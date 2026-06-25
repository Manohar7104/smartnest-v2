const express = require('express');
const {
  cancelOrderController,
  getOrderController,
  getOrdersController,
} = require('../controllers/orderController');
const validateOrder = require('../middleware/validateOrder');

const router = express.Router();

router.get('/', getOrdersController);
router.get('/:id', getOrderController);
router.post('/cancel', validateOrder, cancelOrderController);

module.exports = router;
