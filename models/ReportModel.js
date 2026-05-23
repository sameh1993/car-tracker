const { pool } = require('../config/db');

// ── مساعد: تحقق وتحليل year/month ───────────────────────────
const parseYearMonth = (year, month) => {
  const y = parseInt(year);
  const m = parseInt(month);
  if (!y || !m || m < 1 || m > 12) {
    const err = new Error('year و month مطلوبين وصحيحين (1-12)');
    err.statusCode = 400;
    throw err;
  }
  const start = `${y}-${String(m).padStart(2, '0')}-01`;
  const end   = new Date(y, m, 0).toISOString().slice(0, 10);
  const label = new Date(y, m - 1, 1)
    .toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  return { y, m, start, end, label };
};

// ── مساعد: تواريخ الفترة اليومية/الأسبوعية/الشهرية ────────
const getPeriodDates = (type) => {
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  let start;
  if (type === 'daily') {
    start = end;
  } else if (type === 'weekly') {
    const d = new Date(now);
    d.setDate(now.getDate() - 7);
    start = d.toISOString().slice(0, 10);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().slice(0, 10);
  }
  return { start, end };
};

const ReportModel = {

  // ── تقرير يومي / أسبوعي / شهري (الموجود) ─────────────────
  async generate(type) {
    const { start, end } = getPeriodDates(type);

    const [
      [{ total_cars }],
      oilChanges,
      filterChanges,
      licensesRenewed,
      expiringLicenses,
      overdueOil,
      odometerReadings,
      [costs],
    ] = await Promise.all([

      pool.query('SELECT COUNT(*) AS total_cars FROM cars WHERE is_active = 1')
        .then(([r]) => r),

      pool.query(`
        SELECT o.*, c.plate, c.make, c.model
        FROM   oil_changes o JOIN cars c ON c.id = o.car_id
        WHERE  o.change_date BETWEEN ? AND ?
        ORDER  BY o.change_date DESC
      `, [start, end]).then(([r]) => r),

      pool.query(`
        SELECT f.*, c.plate, c.make, c.model
        FROM   filter_changes f JOIN cars c ON c.id = f.car_id
        WHERE  f.change_date BETWEEN ? AND ?
        ORDER  BY f.change_date DESC
      `, [start, end]).then(([r]) => r),

      pool.query(`
        SELECT l.*, c.plate, c.make, c.model,
          DATEDIFF(l.expiry_date, CURDATE()) AS days_remaining
        FROM   licenses l JOIN cars c ON c.id = l.car_id
        WHERE  l.issue_date BETWEEN ? AND ?
        ORDER  BY l.issue_date DESC
      `, [start, end]).then(([r]) => r),

      pool.query(`
        SELECT l.*, c.plate, c.make, c.model,
          DATEDIFF(l.expiry_date, CURDATE()) AS days_remaining
        FROM   licenses l JOIN cars c ON c.id = l.car_id
        WHERE  c.is_active = 1
          AND  DATEDIFF(l.expiry_date, CURDATE()) BETWEEN -365 AND 30
        ORDER  BY l.expiry_date ASC
      `).then(([r]) => r),

      pool.query(`
        SELECT c.id, c.plate, c.make, c.model, c.current_km,
          latest.km_at_change, latest.next_change_km,
          (CAST(latest.km_at_change AS SIGNED) + CAST(latest.next_change_km AS SIGNED)) AS next_oil_at_km,
          (
            CAST(c.current_km AS SIGNED)
            - CAST(latest.km_at_change AS SIGNED)
            - CAST(latest.next_change_km AS SIGNED)
          ) AS overdue_by_km
        FROM cars c
        JOIN (
          SELECT o1.* FROM oil_changes o1
          WHERE o1.id = (
            SELECT o2.id FROM oil_changes o2
            WHERE  o2.car_id = o1.car_id
            ORDER  BY o2.change_date DESC, o2.id DESC LIMIT 1
          )
        ) latest ON latest.car_id = c.id
        WHERE c.is_active = 1
          AND CAST(c.current_km AS SIGNED) > (
            CAST(latest.km_at_change AS SIGNED) + CAST(latest.next_change_km AS SIGNED)
          )
        ORDER BY overdue_by_km DESC
      `).then(([r]) => r),

      pool.query(`
        SELECT o.*, c.plate, c.make, c.model
        FROM   odometer_logs o JOIN cars c ON c.id = o.car_id
        WHERE  o.reading_date BETWEEN ? AND ?
          AND  o.source = 'manual'
        ORDER  BY o.reading_date DESC
      `, [start, end]).then(([r]) => r),

      pool.query(`
        SELECT
          COALESCE(SUM(CASE WHEN tbl='oil'     THEN cost END),0) AS oil_cost,
          COALESCE(SUM(CASE WHEN tbl='filter'  THEN cost END),0) AS filter_cost,
          COALESCE(SUM(CASE WHEN tbl='license' THEN cost END),0) AS license_cost
        FROM (
          SELECT 'oil'    AS tbl, cost, change_date AS d FROM oil_changes    WHERE change_date BETWEEN ? AND ?
          UNION ALL
          SELECT 'filter',        cost, change_date        FROM filter_changes WHERE change_date BETWEEN ? AND ?
          UNION ALL
          SELECT 'license',       cost, issue_date         FROM licenses       WHERE issue_date  BETWEEN ? AND ?
        ) t
      `, [start, end, start, end, start, end]).then(([r]) => r),
    ]);

    const totalCost = (
      Number(costs.oil_cost) +
      Number(costs.filter_cost) +
      Number(costs.license_cost)
    ).toFixed(2);

    return {
      period: { type, start, end },
      summary: {
        total_cars,
        oil_changes_count:       oilChanges.length,
        filter_changes_count:    filterChanges.length,
        licenses_renewed_count:  licensesRenewed.length,
        overdue_oil_count:       overdueOil.length,
        expiring_licenses_count: expiringLicenses.length,
        total_cost:              totalCost,
        oil_cost:                Number(costs.oil_cost).toFixed(2),
        filter_cost:             Number(costs.filter_cost).toFixed(2),
        license_cost:            Number(costs.license_cost).toFixed(2),
      },
      oil_changes:       oilChanges,
      filter_changes:    filterChanges,
      licenses_renewed:  licensesRenewed,
      expiring_licenses: expiringLicenses,
      overdue_oil:       overdueOil,
      odometer_readings: odometerReadings,
    };
  },

  // ── تقرير 1: قراءات العداد لكل السيارات خلال شهر معين ─────
  // GET /api/reports/odometer?year=2025&month=3
  async odometerByMonth(year, month) {
    const { start, end, label } = parseYearMonth(year, month);

    const [readings, cars] = await Promise.all([

      // كل قراءات الشهر مرتبة بالسيارة ثم التاريخ
      pool.query(`
        SELECT
          o.id, o.reading_date, o.reading_km, o.source, o.notes,
          c.id   AS car_id,
          c.plate, c.make, c.model, c.driver,
          COALESCE(
            CAST(o.reading_km AS SIGNED) - (
              SELECT CAST(prev.reading_km AS SIGNED)
              FROM   odometer_logs prev
              WHERE  prev.car_id = o.car_id
                AND  (prev.reading_date < o.reading_date
                      OR (prev.reading_date = o.reading_date AND prev.id < o.id))
              ORDER  BY prev.reading_date DESC, prev.id DESC
              LIMIT  1
            ), 0
          ) AS km_since_prev
        FROM odometer_logs o
        JOIN cars c ON c.id = o.car_id
        WHERE o.reading_date BETWEEN ? AND ?
          AND c.is_active = 1
        ORDER BY c.plate ASC, o.reading_date ASC, o.id ASC
      `, [start, end]).then(([r]) => r),

      // كل السيارات النشطة لبناء ملخص مضبوط من نفس القراءات
      pool.query(`
        SELECT
          c.id AS car_id, c.plate, c.make, c.model, c.driver
        FROM cars c
        WHERE c.is_active = 1
        ORDER BY c.plate ASC
      `).then(([r]) => r),
    ]);

    const readingsByCar = new Map();
    for (const reading of readings) {
      if (!readingsByCar.has(reading.car_id)) {
        readingsByCar.set(reading.car_id, []);
      }
      readingsByCar.get(reading.car_id).push(reading);
    }

    const perCarSummary = cars
      .map((car) => {
        const carReadings = readingsByCar.get(car.car_id) || [];
        const firstReading = carReadings[0] || null;
        const lastReading = carReadings[carReadings.length - 1] || null;
        const totalKmDriven = carReadings.reduce((sum, reading) => {
          const diff = Number(reading.km_since_prev) || 0;
          return sum + Math.max(diff, 0);
        }, 0);

        return {
          ...car,
          readings_count: carReadings.length,
          first_km: firstReading ? firstReading.reading_km : null,
          last_km: lastReading ? lastReading.reading_km : null,
          total_km_driven: totalKmDriven,
          first_date: firstReading ? firstReading.reading_date : null,
          last_date: lastReading ? lastReading.reading_date : null,
        };
      })
      .sort((a, b) => {
        const diff = (Number(b.total_km_driven) || 0) - (Number(a.total_km_driven) || 0);
        if (diff !== 0) return diff;
        return String(a.plate || "").localeCompare(String(b.plate || ""));
      });

    const totalKmDriven = perCarSummary
      .reduce((s, r) => s + (Number(r.total_km_driven) || 0), 0);

    return {
      period: { year: parseInt(year), month: parseInt(month), start, end, label },
      summary: {
        total_readings:  readings.length,
        total_km_driven: totalKmDriven,
        cars_with_data:  perCarSummary.filter(r => r.readings_count > 0).length,
        cars_total:      perCarSummary.length,
      },
      per_car_summary: perCarSummary,
      readings,
    };
  },

  // ── تقرير 2: تكاليف الصيانة (زيت + فلاتر) خلال شهر معين ──
  // GET /api/reports/maintenance-costs?year=2025&month=3
  async maintenanceCostsByMonth(year, month) {
    const { start, end, label } = parseYearMonth(year, month);

    const [oilChanges, filterChanges, perCarCosts, [monthlySummary]] =
      await Promise.all([

        // تفاصيل تغييرات الزيت
        pool.query(`
          SELECT
            o.id, o.change_date, o.km_at_change, o.next_change_km,
            o.oil_brand, o.oil_grade, o.cost, o.workshop, o.notes,
            c.plate, c.make, c.model, c.driver
          FROM oil_changes o
          JOIN cars c ON c.id = o.car_id
          WHERE o.change_date BETWEEN ? AND ?
          ORDER BY c.plate ASC, o.change_date ASC
        `, [start, end]).then(([r]) => r),

        // تفاصيل تغييرات الفلاتر
        pool.query(`
          SELECT
            f.id, f.change_date, f.filter_type, f.km_at_change,
            f.next_change_km, f.brand, f.cost, f.workshop, f.notes,
            c.plate, c.make, c.model, c.driver
          FROM filter_changes f
          JOIN cars c ON c.id = f.car_id
          WHERE f.change_date BETWEEN ? AND ?
          ORDER BY c.plate ASC, f.change_date ASC
        `, [start, end]).then(([r]) => r),

        // تكلفة كل سيارة (زيت + فلاتر مجمعين)
        pool.query(`
          SELECT
            c.id AS car_id, c.plate, c.make, c.model, c.driver,
            COALESCE(SUM(CASE WHEN src='oil'    THEN cost END), 0) AS oil_cost,
            COALESCE(SUM(CASE WHEN src='filter' THEN cost END), 0) AS filter_cost,
            COALESCE(SUM(cost), 0)                                  AS total_cost,
            COUNT(*)                                                AS operations_count
          FROM cars c
          LEFT JOIN (
            SELECT car_id, COALESCE(cost,0) AS cost, 'oil'    AS src FROM oil_changes    WHERE change_date BETWEEN ? AND ?
            UNION ALL
            SELECT car_id, COALESCE(cost,0),          'filter'        FROM filter_changes WHERE change_date BETWEEN ? AND ?
          ) ops ON ops.car_id = c.id
          WHERE c.is_active = 1
          GROUP BY c.id, c.plate, c.make, c.model, c.driver
          ORDER BY total_cost DESC
        `, [start, end, start, end]).then(([r]) => r),

        // إجماليات الشهر
        pool.query(`
          SELECT
            COALESCE(SUM(CASE WHEN src='oil'    THEN cost END),0) AS total_oil_cost,
            COALESCE(SUM(CASE WHEN src='filter' THEN cost END),0) AS total_filter_cost,
            COALESCE(SUM(cost), 0)                                 AS grand_total,
            COUNT(CASE WHEN src='oil'    THEN 1 END)               AS oil_count,
            COUNT(CASE WHEN src='filter' THEN 1 END)               AS filter_count
          FROM (
            SELECT COALESCE(cost,0) AS cost, 'oil'    AS src FROM oil_changes    WHERE change_date BETWEEN ? AND ?
            UNION ALL
            SELECT COALESCE(cost,0),          'filter'        FROM filter_changes WHERE change_date BETWEEN ? AND ?
          ) t
        `, [start, end, start, end]).then(([r]) => r),
      ]);

    return {
      period: { year: parseInt(year), month: parseInt(month), start, end, label },
      summary: {
        grand_total:          Number(monthlySummary.grand_total).toFixed(2),
        total_oil_cost:       Number(monthlySummary.total_oil_cost).toFixed(2),
        total_filter_cost:    Number(monthlySummary.total_filter_cost).toFixed(2),
        oil_changes_count:    monthlySummary.oil_count,
        filter_changes_count: monthlySummary.filter_count,
        cars_maintained:      perCarCosts.filter(c => c.operations_count > 0).length,
      },
      per_car_costs:  perCarCosts,
      oil_changes:    oilChanges,
      filter_changes: filterChanges,
    };
  },

  // ── تقرير يومي: حالة تغيير الزيت لكل السيارات ─────────────
  // GET /api/reports/oil-status
  // بيرجع جدول فيه: رقم اللوحة، عداد آخر تغيير زيت،
  // العداد الحالي، المتبقي، والحالة
  async dailyOilStatus() {
    const today = new Date().toISOString().slice(0, 10);

    const [rows] = await pool.query(`
      SELECT
        c.id,
        c.plate,
        c.make,
        c.model,
        c.driver,
        c.current_km,
        -- آخر تغيير زيت
        oil.change_date                              AS last_oil_date,
        oil.km_at_change                             AS last_oil_km,
        oil.next_change_km,
        oil.oil_brand,
        oil.oil_grade,
        -- الكيلومتر المحدد للتغيير القادم
        (CAST(oil.km_at_change AS SIGNED) + CAST(oil.next_change_km AS SIGNED)) AS next_oil_at_km,
        -- الكيلومتر المتبقي (سالب = متأخر)
        (
          CAST(oil.km_at_change AS SIGNED)
          + CAST(oil.next_change_km AS SIGNED)
          - CAST(c.current_km AS SIGNED)
        ) AS km_remaining,
        -- النسبة المئوية للاستهلاك
        ROUND(
          (CAST(c.current_km AS SIGNED) - CAST(oil.km_at_change AS SIGNED))
          / NULLIF(CAST(oil.next_change_km AS SIGNED), 0) * 100
        , 1)                                         AS usage_pct
      FROM cars c
      LEFT JOIN (
        -- آخر تغيير زيت لكل سيارة
        SELECT o1.*
        FROM   oil_changes o1
        WHERE  o1.id = (
          SELECT o2.id FROM oil_changes o2
          WHERE  o2.car_id = o1.car_id
          ORDER  BY o2.change_date DESC, o2.id DESC
          LIMIT  1
        )
      ) oil ON oil.car_id = c.id
      WHERE c.is_active = 1
      ORDER BY
        -- الأكثر إلحاحاً أولاً
        CASE
          WHEN oil.km_at_change IS NULL THEN 0          -- لم يُسجَّل زيت
          WHEN (
            CAST(oil.km_at_change AS SIGNED)
            + CAST(oil.next_change_km AS SIGNED)
            - CAST(c.current_km AS SIGNED)
          ) < 0 THEN 1  -- متأخر
          WHEN (
            CAST(oil.km_at_change AS SIGNED)
            + CAST(oil.next_change_km AS SIGNED)
            - CAST(c.current_km AS SIGNED)
          ) < 1500 THEN 2  -- عاجل
          WHEN (
            CAST(oil.km_at_change AS SIGNED)
            + CAST(oil.next_change_km AS SIGNED)
            - CAST(c.current_km AS SIGNED)
          ) < 3000 THEN 3  -- قريب
          ELSE 4
        END ASC,
        c.plate ASC
    `);

    // إحصائيات ملخص
    const total       = rows.length;
    const noRecord    = rows.filter(r => r.last_oil_km == null).length;
    const overdue     = rows.filter(r => r.km_remaining != null && r.km_remaining  <    0).length;
    const urgent      = rows.filter(r => r.km_remaining != null && r.km_remaining >= 0 && r.km_remaining < 1500).length;
    const soon        = rows.filter(r => r.km_remaining != null && r.km_remaining >= 1500 && r.km_remaining < 3000).length;
    const ok          = rows.filter(r => r.km_remaining != null && r.km_remaining >= 3000).length;

    return {
      generated_at: today,
      summary: { total, overdue, urgent, soon, ok, no_record: noRecord },
      rows,
    };
  },
};

module.exports = ReportModel;
