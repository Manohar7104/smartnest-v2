# SmartNest Payment Integration

SmartNest uses Shopify checkout, so payment collection is configured in the Shopify admin rather than theme code. The theme prepares the storefront with proper cart checkout flow, dynamic checkout support on product pages, account order history, and order status links.

## Development Store Testing

Use a Shopify development store for demonstrations. No real money should be deducted when using test mode, Bogus Gateway, or manual payment methods such as Cash on Delivery.

## Shopify Bogus Gateway

Setup:

1. Go to **Settings > Payments**.
2. If Shopify Payments is active, deactivate or switch to test mode as needed.
3. Under manual/test providers, activate **Bogus Gateway**.
4. Place a test order through the storefront checkout.

Common test values:

- Approved transaction: card number `1`
- Declined transaction: card number `2`
- Gateway failure: card number `3`
- Use any future expiry date.
- Use any three-digit security code.
- Use any cardholder name.

## Shopify Payments Test Mode

Setup:

1. Go to **Settings > Payments > Shopify Payments**.
2. Enable **Test mode**.
3. Use Shopify's test card numbers from the Shopify Payments test documentation.
4. Confirm order creation, payment status, and customer account order history.

Expected success flow:

1. Customer adds product to cart.
2. Customer checks out.
3. Test payment is approved.
4. Shopify creates the order.
5. Customer sees the Shopify order status page.
6. Customer can view the order in `/account`.

Expected failure flow:

1. Customer submits a declined test card.
2. Shopify checkout displays the payment error.
3. No paid order is created.
4. Customer can retry with another payment method.

## Cash On Delivery

Setup:

1. Go to **Settings > Payments**.
2. Add a manual payment method.
3. Choose **Cash on Delivery** or create a custom manual method.
4. Add clear payment instructions.
5. Save and test checkout.

Order handling:

- Orders should show as pending payment until collected.
- Staff should mark payment as paid after collection.
- Customer account pages will show Shopify's payment status label dynamically.

## Razorpay Future Support

Razorpay is integrated through Shopify-supported payment providers or approved third-party payment apps. Do not add custom card collection fields to the theme.

Recommended approach:

1. Confirm Razorpay availability for the store region.
2. Install/configure Razorpay from Shopify payment settings or approved app flow.
3. Keep payment capture inside Shopify checkout.
4. Test UPI/card/wallet scenarios in Razorpay test mode before enabling live mode.

Theme changes required:

- No direct card form changes.
- Keep cart checkout form pointed to `routes.checkout_url`.
- Keep dynamic checkout buttons enabled on product pages.
- Use account/order templates to display Shopify payment and fulfillment status.

## UPI Future Support

UPI should be enabled through Shopify Payments, Razorpay, or another Shopify-compatible provider where available.

Implementation notes:

- UPI instructions and payment errors are handled by checkout/provider UI.
- The theme should not attempt to collect UPI IDs directly.
- Use order status pages and customer account order details for post-purchase visibility.

## Payment Success Experience

Shopify controls the checkout thank-you page and order status page. SmartNest supports the post-purchase journey by:

- linking customers to account order history,
- showing order payment status,
- showing fulfillment status,
- showing tracking/order status links,
- supporting cancellation requests from the order detail page.

## Payment Failure Experience

Payment failures are handled inside Shopify checkout. SmartNest should:

- keep cart contents available when checkout payment fails,
- avoid custom payment logic in theme code,
- let Shopify display gateway-specific error messages,
- allow customers to retry checkout or choose COD/manual payment when enabled.

## Final Pre-Launch Checklist

- Test checkout with Bogus Gateway approved, declined, and failure scenarios.
- Test Shopify Payments test mode if available.
- Test COD order creation and admin payment marking.
- Confirm order confirmation email branding.
- Confirm `/account` shows new orders after checkout.
- Confirm `/account/orders/*` shows payment, fulfillment, tracking, and cancellation request UI.
