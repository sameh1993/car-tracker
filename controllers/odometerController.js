const OdometerModel = require('../models/OdometerModel');

const odometerController = {

  // GET /api/odometer/:carId
  getHistory: async (req, res) => {
    const logs = await OdometerModel.findByCar(req.params.carId);
    res.json({ success: true, data: logs });
  },

  // GET /api/odometer/:carId/latest
  getLatest: async (req, res) => {
    const log = await OdometerModel.findLatestByCar(req.params.carId);
    res.json({ success: true, data: log });
  },

  // POST /api/odometer
  create: async (req, res) => {
    const { car_id, reading_km } = req.body;

    if (!car_id || !reading_km) {
      return res.status(400).json({
        success: false,
        message: 'car_id و reading_km مطلوبين',
      });
    }

    // تحقق إن القراءة الجديدة أكبر من الأخيرة
    const lastLog = await OdometerModel.findLatestByCar(car_id);
    if (lastLog && Number(reading_km) <= lastLog.reading_km) {
      return res.status(400).json({
        success: false,
        message: `القراءة الجديدة (${Number(reading_km).toLocaleString()} كم) لازم تكون أكبر من آخر قراءة (${lastLog.reading_km.toLocaleString()} كم)`,
      });
    }

    const reading_date = req.body.reading_date || new Date().toISOString().slice(0, 10);

    const insertId = await OdometerModel.create({
      car_id,
      reading_km: Number(reading_km),
      reading_date,
      source: 'manual',
      notes:  req.body.notes || null,
    });

    // حدّث الكيلومتراج الحالي في جدول cars
    await OdometerModel.syncCarKm(car_id, Number(reading_km));

    const newLog = await OdometerModel.findById(insertId);
    res.status(201).json({ success: true, data: newLog });
  },

  // DELETE /api/odometer/:id
  remove: async (req, res) => {
    const log = await OdometerModel.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'القراءة مش موجودة' });
    }

    await OdometerModel.delete(req.params.id);

    // أعد حساب current_km من آخر قراءة متبقية
    await OdometerModel.recalcCarKm(log.car_id);

    res.json({ success: true, message: 'تم حذف القراءة' });
  },
};

module.exports = odometerController;
