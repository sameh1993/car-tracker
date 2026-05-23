const express      = require('express');
const router       = express.Router();
const oilController = require('../controllers/oilController');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/due',    asyncHandler(oilController.getDue));
router.get('/',       asyncHandler(oilController.getAll));
router.post('/',      asyncHandler(oilController.create));
router.delete('/:id', asyncHandler(oilController.remove));

module.exports = router;
