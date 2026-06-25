const {
  cancelOrder,
  getOrderById,
  getOrders,
} = require("../services/shopify");

function formatAddress(address) {
  if (!address) {
    return null;
  }

  return {
    name: address.name || "",
    address1: address.address1 || "",
    address2: address.address2 || "",
    city: address.city || "",
    province: address.province || "",
    zip: address.zip || "",
    country: address.country || "",
    phone: address.phone || "",
  };
}

function formatOrder(order) {
  const total = order.currentTotalPriceSet?.shopMoney;

  return {
    id: order.id,
    name: order.name,
    createdAt: order.createdAt,
    financialStatus: order.displayFinancialStatus,
    fulfillmentStatus: order.displayFulfillmentStatus,
    cancelled: Boolean(order.cancelledAt),
    total: total?.amount || "0.00",
    currency: total?.currencyCode || "INR",
    shippingAddress: formatAddress(order.shippingAddress),
    billingAddress: formatAddress(order.billingAddress),
    lineItems: (order.lineItems?.nodes || []).map((lineItem) => {
      const price = lineItem.originalUnitPriceSet?.shopMoney;

      return {
        id: lineItem.id,
        title: lineItem.title,
        quantity: lineItem.quantity,
        image: lineItem.image?.url || "",
        price: price?.amount || "0.00",
      };
    }),
  };
}

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
        total: order.currentTotalPriceSet?.shopMoney?.amount || "0.00",
        currency: order.currentTotalPriceSet?.shopMoney?.currencyCode || "INR",
        cancelled: Boolean(order.cancelledAt),
      })),
    );
  } catch (error) {
    return next(error);
  }
}

async function getOrderController(req, res, next) {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.json(formatOrder(order));
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
      status: "cancelled",
      message: "Order cancelled successfully",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  cancelOrderController,
  getOrderController,
  getOrdersController,
};
