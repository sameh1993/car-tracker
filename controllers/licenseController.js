const LicenseModel = require("../models/LicenseModel");

const licenseController = {
  // GET /api/licenses
  getAll: async (req, res) => {
    const rows = await LicenseModel.findAll(req.query.car_id || null);
    res.json({ success: true, data: rows });
  },

  // GET /api/licenses/expiring
  getExpiring: async (req, res) => {
    const days = Number(req.query.days) || 3;
    const rows = await LicenseModel.findExpiring(days);
    res.json({ success: true, data: rows });
  },

  // POST /api/licenses
  create: async (req, res) => {
    const { car_id, issue_date, expiry_date } = req.body;

    if (!car_id || !issue_date || !expiry_date) {
      return res.status(400).json({
        success: false,
        message: "car_id و issue_date و expiry_date مطلوبين",
      });
    }

    await LicenseModel.create(req.body);
    res.status(201).json({ success: true, message: "تم إضافة الوثيقة" });
  },

  // DELETE /api/licenses/:id
  remove: async (req, res) => {
    await LicenseModel.delete(req.params.id);
    res.json({ success: true, message: "تم الحذف" });
  },
};

module.exports = licenseController;
