const express          = require('express');
const router           = express.Router();
const filterController = require('../controllers/filterController');
const asyncHandler     = require('../middleware/asyncHandler');

router.get('/',       asyncHandler(filterController.getAll));
router.post('/',      asyncHandler(filterController.create));
router.delete('/:id', asyncHandler(filterController.remove));

module.exports = router;
