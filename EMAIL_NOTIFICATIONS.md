# SmartNest Email Notifications

Shopify notification templates are managed in **Settings > Notifications** in the Shopify admin. Theme files cannot override these emails directly, so use the following copy and structure when customizing SmartNest notifications.

## Branding Guidelines

- Use the SmartNest logo from Shopify brand settings where possible.
- Primary brand color: `#14594b`.
- Keep CTAs short and action-oriented.
- Use the customer first name only when available.
- Include support contact details and order links in every order-related email.

## Order Confirmation

Subject: `Order {{ order.name }} confirmed - thank you from SmartNest`

Structure:

1. SmartNest logo/header.
2. Greeting: `Hi {{ customer.first_name | default: "there" }},`
3. Confirmation line: `We received your order {{ order.name }}.`
4. Order summary with items, totals, shipping address, and payment status.
5. CTA: `View your order`.
6. Support footer.

Recommended CTA URL: `{{ order_status_url }}`

## Shipping Confirmation

Subject: `Your SmartNest order {{ order.name }} has shipped`

Structure:

1. Shipment status headline.
2. Tracking number and carrier when available.
3. CTA to tracking/order status page.
4. Delivery address reminder.
5. Support footer.

Recommended CTA URL: `{{ fulfillment.tracking_url | default: order_status_url }}`

## Delivery Confirmation

Subject: `Delivered: your SmartNest order {{ order.name }}`

Structure:

1. Delivery confirmation.
2. Short post-purchase care note.
3. CTA to shop again or view order.
4. Support link for delivery issues.

## Cancellation Request Received

Shopify does not include a native customer-triggered cancellation request notification from themes. Use the contact-form request created by `snippets/order-cancellation-request.liquid`, then route submissions through customer support, Shopify Flow, or a helpdesk.

Subject: `Cancellation request received for {{ order.name }}`

Structure:

1. Acknowledge the request.
2. Include order number and request reason.
3. Explain review timing.
4. State that cancellation is not final until confirmed.

Admin workflow options:

- Tag order with `cancellation-requested`.
- Store status in an order metafield, such as `custom.cancellation_status`.
- Use Shopify Flow to notify staff when a contact form includes `order-cancellation-request`.

## Cancellation Approval

Subject: `Cancellation confirmed for {{ order.name }}`

Structure:

1. Confirm cancellation.
2. Explain refund timeline if payment was captured.
3. Include order link.
4. Include support contact.

Use Shopify's order cancellation/refund notification as the source of truth once the admin cancels the order.

## Password Reset

Subject: `Reset your SmartNest account password`

Structure:

1. Short security-focused headline.
2. CTA: `Reset password`.
3. Expiry/security note.
4. Support footer.

Recommended CTA URL: Shopify's provided password reset URL in the notification template.

## Customer Welcome

Subject: `Welcome to SmartNest`

Structure:

1. Welcome message.
2. Explain account benefits: faster checkout, saved addresses, order history.
3. CTA: `Visit your account`.
4. Support footer.

Recommended CTA URL: `{{ shop.url }}/account`
