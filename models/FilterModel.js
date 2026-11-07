const { pool } = require('../config/db');

const FilterModel = {

  // كل تغييرات الفلاتر مع فلاتر اختيارية
  async findAll({ carId = null, filterType = null, from = null, to = null } = {}) {
    const conditions = ['c.is_active = 1'];
    const params     = [];

    if (carId)      { conditions.push('f.car_id = ?');       params.push(carId); }
    if (filterType) { conditions.push('f.filter_type = ?');  params.push(filterType); }
    if (from)       { conditions.push('f.change_date >= ?'); params.push(from); }
    if (to)         { conditions.push('f.change_date <= ?'); params.push(to); }

    const [rows] = await pool.query(`
      SELECT
        f.*, c.plate, c.make, c.model, c.current_km,
        (CAST(f.km_at_change AS SIGNED) + CAST(f.next_change_km AS SIGNED))
          AS next_filter_at_km,
        (
          CAST(f.km_at_change AS SIGNED)
          + CAST(f.next_change_km AS SIGNED)
          - CAST(c.current_km AS SIGNED)
        ) AS km_remaining
      FROM filter_changes f
      JOIN cars c ON c.id = f.car_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY f.change_date DESC
    `, params);
    return rows;
  },

  // أضف تغيير فلتر
  async create({ car_id, filter_type, change_date, km_at_change, next_change_km, brand, cost, workshop, notes }) {
    const [result] = await pool.query(
      `INSERT INTO filter_changes
         (car_id, filter_type, change_date, km_at_change, next_change_km, brand, cost, workshop, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [car_id, filter_type || 'air', change_date, km_at_change,
       next_change_km || 20000, brand || null, cost || null, workshop || null, notes || null]
    );
    return result.insertId;
  },

  // حذف
  async delete(id) {
    await pool.query('DELETE FROM filter_changes WHERE id = ?', [id]);
  },
};

module.exports = FilterModel;
