const express            = require('express');
const router             = express.Router();
const odometerController = require('../controllers/odometerController');
const asyncHandler       = require('../middleware/asyncHandler');

router.get('/:carId/latest', asyncHandler(odometerController.getLatest));
router.get('/:carId',        asyncHandler(odometerController.getHistory));
router.post('/',             asyncHandler(odometerController.create));
router.delete('/:id',        asyncHandler(odometerController.remove));

module.exports = router;
