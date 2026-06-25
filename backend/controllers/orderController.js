const { cancelOrder, getOrders } = require('../services/shopify');

async function getOrdersController(req, res, next) {
  try {
    const orders = await getOrders();

    return res.json(
      orders.map((order) => ({
        id: order.id,
        name: order.name,
        createdAt: order.createdAt,
        financialStatus: order.displayFinancialStatus,
        fulfillmentStatus: order.displayFulfillmentStatus,
        total: order.currentTotalPriceSet?.shopMoney?.amount || '0.00',
        currency:
          order.currentTotalPriceSet?.shopMoney?.currencyCode || 'INR',
        cancelled: Boolean(order.cancelledAt),
      })),
    );
  } catch (error) {
    return next(error);
  }
}

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
  cancelOrderController,
  getOrdersController,
};
