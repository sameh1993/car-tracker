const CarModel      = require('../models/CarModel');
const OdometerModel = require('../models/OdometerModel');

const carController = {

  // GET /api/cars
  getAll: async (req, res) => {
    const cars = await CarModel.findAll();
    res.json({ success: true, data: cars });
  },

  // GET /api/cars/:id
  getOne: async (req, res) => {
    const car = await CarModel.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'السيارة مش موجودة' });
    }
    res.json({ success: true, data: car });
  },

  // POST /api/cars
  create: async (req, res) => {
    const { plate, make, model } = req.body;
    if (!plate?.trim() || !make?.trim() || !model?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'رقم اللوحة والماركة والموديل مطلوبين',
      });
    }

    const insertId = await CarModel.create(req.body);

    // سجل أول قراءة عداد لو اتحدد كيلومتراج
    const km = Number(req.body.current_km);
    if (km > 0) {
      await OdometerModel.create({
        car_id:       insertId,
        reading_km:   km,
        reading_date: new Date().toISOString().slice(0, 10),
        source:       'manual',
        notes:        'القراءة الأولى عند الإضافة',
      });
    }

    const newCar = await CarModel.findById(insertId);
    res.status(201).json({ success: true, data: newCar });
  },

  // PUT /api/cars/:id
  update: async (req, res) => {
    const { plate, make, model } = req.body;
    if (!plate?.trim() || !make?.trim() || !model?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'رقم اللوحة والماركة والموديل مطلوبين',
      });
    }

    const updated = await CarModel.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  },

  // DELETE /api/cars/:id
  remove: async (req, res) => {
    await CarModel.hardDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف السيارة' });
  },
};

module.exports = carController;
