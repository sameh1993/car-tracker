const ReportModel = require('../models/ReportModel');

const VALID_TYPES = ['daily', 'weekly', 'monthly'];

const reportController = {

  // GET /api/reports/:type  (daily | weekly | monthly)
  generate: async (req, res) => {
    const { type } = req.params;
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'النوع لازم يكون daily أو weekly أو monthly',
      });
    }
    const report = await ReportModel.generate(type);
    res.json({ success: true, ...report });
  },

  // GET /api/reports/odometer?year=2025&month=3
  odometerByMonth: async (req, res) => {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year و month مطلوبين — مثال: ?year=2025&month=3',
      });
    }
    const report = await ReportModel.odometerByMonth(year, month);
    res.json({ success: true, ...report });
  },

  // GET /api/reports/maintenance-costs?year=2025&month=3
  maintenanceCosts: async (req, res) => {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year و month مطلوبين — مثال: ?year=2025&month=3',
      });
    }
    const report = await ReportModel.maintenanceCostsByMonth(year, month);
    res.json({ success: true, ...report });
  },

  // GET /api/reports/oil-status
  dailyOilStatus: async (req, res) => {
    const report = await ReportModel.dailyOilStatus();
    res.json({ success: true, ...report });
  },

  // GET /api/reports/costs?car_id=&type=&from=&to=
  costs: async (req, res) => {
    const carId = req.query.car_id || null;
    const type  = req.query.type    || null;
    const from  = req.query.from    || null;
    const to    = req.query.to      || null;

    if (from && to && from > to) {
      return res.status(400).json({
        success: false,
        message: 'تاريخ البداية لازم يكون قبل تاريخ النهاية',
      });
    }

    const rows = await ReportModel.costReport({ carId, type, from, to });

    const totalCost = rows.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
    const costedOps = rows.filter(r => Number(r.cost) > 0).length;
    const carsSet   = new Set(rows.map(r => r.car_id));

    const byCategory = {
      oil:     { cost: 0, count: 0 },
      filter:  { cost: 0, count: 0 },
      license: { cost: 0, count: 0 },
    };
    const perCarMap = new Map();

    rows.forEach(r => {
      const cost = Number(r.cost) || 0;

      if (byCategory[r.category]) {
        byCategory[r.category].cost  += cost;
        byCategory[r.category].count += 1;
      }

      if (!perCarMap.has(r.car_id)) {
        perCarMap.set(r.car_id, {
          car_id: r.car_id,
          plate:  r.plate,
          make:   r.make,
          model:  r.model,
          cost:   0,
          count:  0,
        });
      }
      const car = perCarMap.get(r.car_id);
      car.cost  += cost;
      car.count += 1;
    });

    const perCar = [...perCarMap.values()]
      .map(c => ({ ...c, cost: Number(c.cost.toFixed(2)) }))
      .sort((a, b) => b.cost - a.cost);

    res.json({
      success: true,
      data: {
        rows,
        summary: {
          total_cost:       Number(totalCost.toFixed(2)),
          operations_count: rows.length,
          costed_operations: costedOps,
          cars_count:       carsSet.size,
          avg_cost:         costedOps ? Number((totalCost / costedOps).toFixed(2)) : 0,
          by_category: byCategory,
          per_car: perCar,
        },
      },
    });
  },
};

module.exports = reportController;
