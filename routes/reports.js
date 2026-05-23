const express          = require('express');
const router           = express.Router();
const reportController = require('../controllers/reportController');
const asyncHandler     = require('../middleware/asyncHandler');

// لازم الـ named routes تيجي قبل /:type عشان ميحسبهاش param
router.get('/odometer',          asyncHandler(reportController.odometerByMonth));
router.get('/maintenance-costs', asyncHandler(reportController.maintenanceCosts));
router.get('/oil-status',        asyncHandler(reportController.dailyOilStatus));
router.get('/:type',             asyncHandler(reportController.generate));

module.exports = router;
