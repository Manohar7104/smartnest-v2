const express = require('express');
const {
  cancelOrderController,
  getOrdersController,
} = require('../controllers/orderController');
const validateOrder = require('../middleware/validateOrder');

const router = express.Router();

router.get('/', getOrdersController);
router.post('/cancel', validateOrder, cancelOrderController);

module.exports = router;
