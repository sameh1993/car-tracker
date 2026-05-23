const { pool } = require('../config/db');

const OilModel = {

  // آخر تغيير زيت لكل سيارة (مع فلتر اختياري بالسيارة)
  async findAll(carId = null) {
    const where  = carId ? 'WHERE o.car_id = ?' : '';
    const params = carId ? [carId] : [];
    const [rows] = await pool.query(`
      SELECT
        o.*, c.plate, c.make, c.model, c.current_km,
        (CAST(o.km_at_change AS SIGNED) + CAST(o.next_change_km AS SIGNED)) AS next_oil_at_km,
        (
          CAST(o.km_at_change AS SIGNED)
          + CAST(o.next_change_km AS SIGNED)
          - CAST(c.current_km AS SIGNED)
        ) AS km_remaining
      FROM oil_changes o
      JOIN cars c ON c.id = o.car_id
      JOIN (
        SELECT latest.car_id, latest.id
        FROM oil_changes latest
        WHERE latest.id = (
          SELECT o2.id
          FROM oil_changes o2
          WHERE o2.car_id = latest.car_id
          ORDER BY o2.change_date DESC, o2.id DESC
          LIMIT 1
        )
      ) latest_per_car ON latest_per_car.id = o.id
      ${where}
      ORDER BY o.change_date DESC, o.id DESC
    `, params);
    return rows;
  },

  // السيارات اللي الزيت بتاعها قارب ينتهي (متبقي ≤ 2000 كم)
  async findDue() {
    const [rows] = await pool.query(`
      SELECT
        c.id, c.plate, c.make, c.model, c.current_km,
        latest.change_date AS last_change_date,
        latest.km_at_change,
        latest.next_change_km,
        (CAST(latest.km_at_change AS SIGNED) + CAST(latest.next_change_km AS SIGNED)) AS next_oil_at_km,
        (
          CAST(latest.km_at_change AS SIGNED)
          + CAST(latest.next_change_km AS SIGNED)
          - CAST(c.current_km AS SIGNED)
        ) AS km_remaining,
        latest.oil_brand
      FROM cars c
      JOIN (
        SELECT o1.*
        FROM   oil_changes o1
        WHERE  o1.id = (
          SELECT o2.id FROM oil_changes o2
          WHERE  o2.car_id = o1.car_id
          ORDER  BY o2.change_date DESC, o2.id DESC LIMIT 1
        )
      ) latest ON latest.car_id = c.id
      WHERE c.is_active = 1
        AND (
          CAST(latest.km_at_change AS SIGNED)
          + CAST(latest.next_change_km AS SIGNED)
          - CAST(c.current_km AS SIGNED)
        ) <= 2000
      ORDER BY km_remaining ASC
    `);
    return rows;
  },

  // أضف تغيير زيت
  async create({ car_id, change_date, km_at_change, next_change_km, oil_brand, oil_grade, cost, workshop, notes }) {
    const [result] = await pool.query(
      `INSERT INTO oil_changes
         (car_id, change_date, km_at_change, next_change_km, oil_brand, oil_grade, cost, workshop, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [car_id, change_date, km_at_change, next_change_km || 10000,
       oil_brand || null, oil_grade || null, cost || null, workshop || null, notes || null]
    );
    return result.insertId;
  },

  // حذف
  async delete(id) {
    await pool.query('DELETE FROM oil_changes WHERE id = ?', [id]);
  },
};

module.exports = OilModel;
