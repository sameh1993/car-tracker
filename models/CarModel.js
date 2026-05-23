const { pool } = require('../config/db');

const CarModel = {

  // جيب كل السيارات مع ملخص الصيانة
  async findAll() {
    const [rows] = await pool.query(`
      SELECT
        c.*,
        (SELECT change_date   FROM oil_changes WHERE car_id = c.id ORDER BY change_date DESC LIMIT 1) AS last_oil_date,
        (SELECT km_at_change  FROM oil_changes WHERE car_id = c.id ORDER BY change_date DESC LIMIT 1) AS last_oil_km,
        (SELECT km_at_change + next_change_km
                              FROM oil_changes WHERE car_id = c.id ORDER BY change_date DESC LIMIT 1) AS next_oil_km,
        (SELECT change_date   FROM filter_changes WHERE car_id = c.id AND filter_type='air' ORDER BY change_date DESC LIMIT 1) AS last_air_filter_date,
        (SELECT km_at_change + next_change_km
                              FROM filter_changes WHERE car_id = c.id AND filter_type='air' ORDER BY change_date DESC LIMIT 1) AS next_air_filter_km,
        (SELECT expiry_date   FROM licenses WHERE car_id = c.id ORDER BY expiry_date ASC LIMIT 1) AS nearest_expiry
      FROM cars c
      WHERE c.is_active = 1
      ORDER BY c.plate
    `);
    return rows;
  },

  // جيب سيارة واحدة بالـ id
  async findById(id) {
    const [[row]] = await pool.query(
      'SELECT * FROM cars WHERE id = ? AND is_active = 1',
      [id]
    );
    return row || null;
  },

  // أضف سيارة جديدة
  async create({ plate, make, model, year, color, vin, current_km, driver, notes }) {
    const [result] = await pool.query(
      `INSERT INTO cars (plate, make, model, year, color, vin, current_km, driver, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plate, make, model, year || null, color || null,
       vin || null, current_km || 0, driver || null, notes || null]
    );
    return result.insertId;
  },

  // عدّل سيارة
  async update(id, { plate, make, model, year, color, vin, driver, notes }) {
    await pool.query(
      `UPDATE cars
       SET plate=?, make=?, model=?, year=?, color=?, vin=?, driver=?, notes=?
       WHERE id = ?`,
      [plate, make, model, year || null, color || null,
       vin || null, driver || null, notes || null, id]
    );
    return this.findById(id);
  },

  // حذف فعلي مع تنظيف السجلات التابعة
  async hardDelete(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('DELETE FROM odometer_logs WHERE car_id = ?', [id]);
      await conn.query('DELETE FROM oil_changes WHERE car_id = ?', [id]);
      await conn.query('DELETE FROM filter_changes WHERE car_id = ?', [id]);
      await conn.query('DELETE FROM licenses WHERE car_id = ?', [id]);

      const [result] = await conn.query('DELETE FROM cars WHERE id = ?', [id]);
      if (!result.affectedRows) {
        const err = new Error('السيارة غير موجودة');
        err.statusCode = 404;
        throw err;
      }

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = CarModel;
