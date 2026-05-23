const express       = require('express');
const router        = express.Router();
const carController = require('../controllers/carController');
const asyncHandler  = require('../middleware/asyncHandler');

router.get('/',       asyncHandler(carController.getAll));
router.get('/:id',    asyncHandler(carController.getOne));
router.post('/',      asyncHandler(carController.create));
router.put('/:id',    asyncHandler(carController.update));
router.delete('/:id', asyncHandler(carController.remove));

module.exports = router;
