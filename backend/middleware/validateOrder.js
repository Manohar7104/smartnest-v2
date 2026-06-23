const { getOrderForCancellation, toOrderGid } = require("../services/shopify");

function isFulfilled(order) {
  const fulfilledStatuses = new Set(["FULFILLED", "PARTIALLY_FULFILLED"]);

  return fulfilledStatuses.has(order.displayFulfillmentStatus);
}

async function validateOrder(req, res, next) {
  const { orderId } = req.body || {};

  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({
      success: false,
      message:
        "orderId is required and must be a Shopify order ID or Order GID.",
    });
  }

  try {
    const order = await getOrderForCancellation(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.cancelledAt) {
      return res.status(409).json({
        success: false,
        message: "Order is already cancelled.",
      });
    }

    if (isFulfilled(order)) {
      return res.status(409).json({
        success: false,
        message: "Fulfilled orders cannot be cancelled through this endpoint.",
      });
    }

    // Future production enhancement:
    // Validate that the logged-in Shopify customer owns this order before
    // cancelling. A production implementation should use a signed customer
    // session/token or an app proxy with HMAC verification, then compare the
    // authenticated customer ID/email with the Admin GraphQL order.customer.
    // This is intentionally not enforced in development, per project request.
    req.order = order;
    req.orderGid = toOrderGid(orderId);

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateOrder;
