const { pool } = require('../config/db');

const OdometerModel = {

  // كل قراءات سيارة مع حساب الفرق بين كل قراءة والسابقة
  // بنستخدم subquery بدل LAG() عشان تشتغل على MariaDB القديمة
  async findByCar(carId) {
    const [rows] = await pool.query(`
      SELECT
        o.*,
        c.plate, c.make, c.model,
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
        ) AS km_since_last
      FROM odometer_logs o
      JOIN cars c ON c.id = o.car_id
      WHERE o.car_id = ?
      ORDER BY o.reading_date DESC, o.id DESC
    `, [carId]);
    return rows;
  },

  // تقرير قراءات كل السيارات (مع فلترة اختيارية بالسيارة والتاريخ)
  // نفس منطق findByCar لكن من غير تحديد سيارة إجبارياً
  async findAll({ carId = null, from = null, to = null } = {}) {
    const where = ['c.is_active = 1'];
    const params = [];

    if (carId) {
      where.push('o.car_id = ?');
      params.push(carId);
    }
    if (from) {
      where.push('o.reading_date >= ?');
      params.push(from);
    }
    if (to) {
      where.push('o.reading_date <= ?');
      params.push(to);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.query(`
      SELECT
        o.*,
        c.plate, c.make, c.model,
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
        ) AS km_since_last
      FROM odometer_logs o
      JOIN cars c ON c.id = o.car_id
      ${whereSql}
      ORDER BY o.reading_date DESC, o.id DESC
    `, params);
    return rows;
  },

  // آخر قراءة لسيارة
  async findLatestByCar(carId) {
    const [[row]] = await pool.query(`
      SELECT * FROM odometer_logs
      WHERE  car_id = ?
      ORDER  BY reading_date DESC, id DESC
      LIMIT  1
    `, [carId]);
    return row || null;
  },

  // جيب قراءة واحدة بالـ id
  async findById(id) {
    const [[row]] = await pool.query(
      'SELECT * FROM odometer_logs WHERE id = ?',
      [id]
    );
    return row || null;
  },

  // أضف قراءة جديدة
  async create({ car_id, reading_km, reading_date, source = 'manual', notes }) {
    const [result] = await pool.query(
      `INSERT INTO odometer_logs (car_id, reading_km, reading_date, source, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [car_id, reading_km, reading_date, source, notes || null]
    );
    return result.insertId;
  },

  // حذف قراءة
  async delete(id) {
    await pool.query('DELETE FROM odometer_logs WHERE id = ?', [id]);
  },

  // تحديث current_km في جدول cars
  async syncCarKm(carId, km) {
    await pool.query(
      'UPDATE cars SET current_km = GREATEST(current_km, ?) WHERE id = ?',
      [km, carId]
    );
  },

  // إعادة حساب current_km بعد حذف قراءة
  async recalcCarKm(carId) {
    const latest = await this.findLatestByCar(carId);
    if (latest) {
      await pool.query(
        'UPDATE cars SET current_km = ? WHERE id = ?',
        [latest.reading_km, carId]
      );
    }
  },
};

module.exports = OdometerModel;
