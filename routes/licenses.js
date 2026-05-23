const express           = require('express');
const router            = express.Router();
const licenseController = require('../controllers/licenseController');
const asyncHandler      = require('../middleware/asyncHandler');

router.get('/expiring', asyncHandler(licenseController.getExpiring));
router.get('/',         asyncHandler(licenseController.getAll));
router.post('/',        asyncHandler(licenseController.create));
router.delete('/:id',   asyncHandler(licenseController.remove));

module.exports = router;
