const { pool } = require('../config/db');

const LicenseModel = {

  // كل الوثائق (مع فلتر اختياري)
  async findAll(carId = null) {
    const where  = carId ? 'WHERE l.car_id = ?' : '';
    const params = carId ? [carId] : [];
    const [rows] = await pool.query(`
      SELECT
        l.*, c.plate, c.make, c.model,
        DATEDIFF(l.expiry_date, CURDATE()) AS days_remaining
      FROM licenses l
      JOIN cars c ON c.id = l.car_id
      ${where}
      ORDER BY l.expiry_date ASC
    `, params);
    return rows;
  },

  // الرخص اللي ستنتهي خلال N يوم
  async findExpiring(days = 30) {
    const [rows] = await pool.query(`
      SELECT
        l.*, c.plate, c.make, c.model,
        DATEDIFF(l.expiry_date, CURDATE()) AS days_remaining
      FROM licenses l
      JOIN cars c ON c.id = l.car_id
      WHERE c.is_active = 1
        AND DATEDIFF(l.expiry_date, CURDATE()) <= ?
      ORDER BY l.expiry_date ASC
    `, [days]);
    return rows;
  },

  // أضف وثيقة
  async create({ car_id, doc_type, doc_number, issue_date, expiry_date, cost, issuer, notes }) {
    const [result] = await pool.query(
      `INSERT INTO licenses (car_id, doc_type, doc_number, issue_date, expiry_date, cost, issuer, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [car_id, doc_type || 'license', doc_number || null,
       issue_date, expiry_date, cost || null, issuer || null, notes || null]
    );
    return result.insertId;
  },

  // حذف
  async delete(id) {
    await pool.query('DELETE FROM licenses WHERE id = ?', [id]);
  },
};

module.exports = LicenseModel;
