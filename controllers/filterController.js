const FilterModel   = require('../models/FilterModel');
const OdometerModel = require('../models/OdometerModel');

const FILTER_LABELS = {
  air:   'فلتر هواء',
  oil:   'فلتر زيت',
  fuel:  'فلتر بنزين',
  cabin: 'فلتر كابينة',
  other: 'أخرى',
};

const filterController = {

  // GET /api/filters
  getAll: async (req, res) => {
    const rows = await FilterModel.findAll({
      carId:      req.query.car_id      || null,
      filterType: req.query.filter_type || null,
    });
    res.json({ success: true, data: rows });
  },

  // POST /api/filters
  create: async (req, res) => {
    const { car_id, change_date, km_at_change } = req.body;

    if (!car_id || !change_date || !km_at_change) {
      return res.status(400).json({
        success: false,
        message: 'car_id و change_date و km_at_change مطلوبين',
      });
    }

    await FilterModel.create(req.body);

    // تحديث الكيلومتراج + قراءة عداد تلقائية
    const filterType = req.body.filter_type || 'air';
    await OdometerModel.syncCarKm(car_id, Number(km_at_change));
    await OdometerModel.create({
      car_id,
      reading_km:   Number(km_at_change),
      reading_date: change_date,
      source:       'filter_change',
      notes:        `قراءة تلقائية عند تغيير ${FILTER_LABELS[filterType] || 'فلتر'}`,
    });

    const rows = await FilterModel.findAll({ carId: car_id });
    res.status(201).json({ success: true, data: rows[0] });
  },

  // DELETE /api/filters/:id
  remove: async (req, res) => {
    await FilterModel.delete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  },
};

module.exports = filterController;
