const ReportModel = require('../models/ReportModel');

const VALID_TYPES = ['daily', 'weekly', 'monthly'];

const reportController = {

  // GET /api/reports/:type  (daily | weekly | monthly)
  generate: async (req, res) => {
    const { type } = req.params;
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'النوع لازم يكون daily أو weekly أو monthly',
      });
    }
    const report = await ReportModel.generate(type);
    res.json({ success: true, ...report });
  },

  // GET /api/reports/odometer?year=2025&month=3
  odometerByMonth: async (req, res) => {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year و month مطلوبين — مثال: ?year=2025&month=3',
      });
    }
    const report = await ReportModel.odometerByMonth(year, month);
    res.json({ success: true, ...report });
  },

  // GET /api/reports/maintenance-costs?year=2025&month=3
  maintenanceCosts: async (req, res) => {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year و month مطلوبين — مثال: ?year=2025&month=3',
      });
    }
    const report = await ReportModel.maintenanceCostsByMonth(year, month);
    res.json({ success: true, ...report });
  },

  // GET /api/reports/oil-status
  dailyOilStatus: async (req, res) => {
    const report = await ReportModel.dailyOilStatus();
    res.json({ success: true, ...report });
  },
};

module.exports = reportController;
