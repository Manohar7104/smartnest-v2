const { cancelOrder } = require('../services/shopify');

async function cancelOrderController(req, res, next) {
  try {
    // API request flow:
    // 1. validateOrder confirms the order exists and is still cancellable.
    // 2. The controller calls the Shopify service mutation.
    // 3. The browser receives a compact success payload for immediate UI update.
    await cancelOrder(req.orderGid);

    return res.json({
      success: true,
      orderId: req.orderGid,
      status: 'cancelled',
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  cancelOrderController
};
