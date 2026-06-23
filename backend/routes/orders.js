const express = require('express');
const { cancelOrderController } = require('../controllers/orderController');
const validateOrder = require('../middleware/validateOrder');

const router = express.Router();

router.post('/cancel', validateOrder, cancelOrderController);

module.exports = router;
