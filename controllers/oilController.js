const OilModel      = require('../models/OilModel');
const OdometerModel = require('../models/OdometerModel');

const oilController = {

  // GET /api/oil
  getAll: async (req, res) => {
    const rows = await OilModel.findAll(req.query.car_id || null);
    res.json({ success: true, data: rows });
  },

  // GET /api/oil/due
  getDue: async (req, res) => {
    const rows = await OilModel.findDue();
    res.json({ success: true, data: rows });
  },

  // POST /api/oil
  create: async (req, res) => {
    const { car_id, change_date, km_at_change } = req.body;

    if (!car_id || !change_date || !km_at_change) {
      return res.status(400).json({
        success: false,
        message: 'car_id و change_date و km_at_change مطلوبين',
      });
    }

    const insertId = await OilModel.create(req.body);

    // تحديث الكيلومتراج + تسجيل قراءة عداد تلقائية
    await OdometerModel.syncCarKm(car_id, Number(km_at_change));
    await OdometerModel.create({
      car_id,
      reading_km:   Number(km_at_change),
      reading_date: change_date,
      source:       'oil_change',
      notes:        'قراءة تلقائية عند تغيير الزيت',
    });

    // جيب الـ row الجديد من قاعدة البيانات
    const [{ data: all }] = await Promise.resolve(
      OilModel.findAll(car_id).then(rows => [{ data: rows }])
    );
    const newRow = all.find(r => r.id === insertId);
    res.status(201).json({ success: true, data: newRow });
  },

  // DELETE /api/oil/:id
  remove: async (req, res) => {
    await OilModel.delete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  },
};

module.exports = oilController;
