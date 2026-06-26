const API_VERSION = process.env.SHOPIFY_API_VERSION || "2026-04";

const ORDER_QUERY = `
  query GetOrderForCancellation($id: ID!) {
    order: node(id: $id) {
      ... on Order {
        id
        name
        cancelledAt
        displayFulfillmentStatus
      }
    }
  }
`;

const ORDERS_QUERY = `
  query GetOrders {
    orders(first: 20, sortKey: CREATED_AT, reverse: true) {
      nodes {
      id
      name
      createdAt
      statusPageUrl
      displayFinancialStatus
      displayFulfillmentStatus
        currentTotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        cancelledAt
      }
    }
  }
`;

const ORDER_DETAILS_QUERY = `
  query GetOrderDetails($id: ID!) {
    order: node(id: $id) {
      ... on Order {
        id
        name
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        cancelledAt
        currentTotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 50) {
          nodes {
            id
            title
            quantity
            image {
              url
              altText
            }
            originalUnitPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

const CANCEL_ORDER_MUTATION = `
  mutation CancelOrder(
    $orderId: ID!
    $notifyCustomer: Boolean
    $refund: Boolean!
    $restock: Boolean!
    $reason: OrderCancelReason!
    $staffNote: String
  ) {
    orderCancel(
      orderId: $orderId
      notifyCustomer: $notifyCustomer
      refund: $refund
      restock: $restock
      reason: $reason
      staffNote: $staffNote
    ) {
      job {
        id
        done
      }
      orderCancelUserErrors {
        field
        message
        code
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function getShopifyConfig() {
  const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

  if (!shopDomain || !accessToken) {
    throw new Error(
      "Missing Shopify Admin API configuration. Set SHOPIFY_SHOP_DOMAIN and SHOPIFY_ADMIN_API_ACCESS_TOKEN.",
    );
  }

  return {
    accessToken,
    endpoint: `https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`,
  };
}

function toOrderGid(orderId) {
  if (typeof orderId !== "string") {
    return "";
  }

  const trimmedOrderId = orderId.trim();

  if (trimmedOrderId.startsWith("gid://shopify/Order/")) {
    return trimmedOrderId;
  }

  // Shopify Liquid exposes order.id as a numeric ID on customer order pages.
  // The Admin GraphQL API requires the global ID format below.
  if (/^\d+$/.test(trimmedOrderId)) {
    return `gid://shopify/Order/${trimmedOrderId}`;
  }

  return trimmedOrderId;
}

async function graphqlRequest(query, variables = {}) {
  const { endpoint, accessToken } = getShopifyConfig();

  // Shopify authentication: Admin API calls use the private Admin access token
  // in the X-Shopify-Access-Token header. Never expose this token in Liquid or
  // browser JavaScript.
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.errors?.[0]?.message ||
      `Shopify Admin API request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  if (payload.errors?.length) {
    const error = new Error(
      payload.errors.map((item) => item.message).join("; "),
    );
    error.status = 502;
    error.details = payload.errors;
    throw error;
  }

  return payload.data;
}

async function getOrderForCancellation(orderId) {
  const gid = toOrderGid(orderId);

  // GraphQL query: fetch only the fields needed for development validation.
  const data = await graphqlRequest(ORDER_QUERY, { id: gid });

  return data.order;
}

async function getOrders() {
  // Future Enhancement: filter these Admin API results by the authenticated
  // customer once customer session ownership validation is added.
  const data = await graphqlRequest(ORDERS_QUERY);

  return data.orders?.nodes || [];
}

async function getOrderById(orderId) {
  const gid = toOrderGid(orderId);

  // Future Enhancement: verify this order belongs to the authenticated
  // customer before returning details.
  const data = await graphqlRequest(ORDER_DETAILS_QUERY, { id: gid });

  return data.order;
}

async function cancelOrder(orderId) {
  const gid = toOrderGid(orderId);

  // GraphQL mutation: cancels the order in Shopify Admin. These defaults keep
  // the action conservative for development: no automatic refund, no automatic
  // restock, and no customer notification until business rules are finalized.
  const data = await graphqlRequest(CANCEL_ORDER_MUTATION, {
    orderId: gid,
    notifyCustomer: false,
    refund: false,
    restock: false,
    reason: "CUSTOMER",
    staffNote: "Cancelled by SmartNest real-time cancellation endpoint.",
  });

  const payload = data.orderCancel;
  const userErrors = [
    ...(payload.orderCancelUserErrors || []),
    ...(payload.userErrors || []),
  ];

  if (userErrors.length > 0) {
    const error = new Error(userErrors.map((item) => item.message).join("; "));
    error.status = 422;
    error.details = userErrors;
    throw error;
  }

  return payload;
}

module.exports = {
  API_VERSION,
  cancelOrder,
  getOrderById,
  getOrders,
  getOrderForCancellation,
  toOrderGid,
};
