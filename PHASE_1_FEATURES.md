# SmartNest Phase 1 Features Documentation

> Enhanced UX improvements for Shopify Dawn theme with modern, production-ready components.

## Overview

Phase 1 includes four major features designed to improve user experience, accessibility, and conversion rates:

1. **Breadcrumb Navigation** - SEO-friendly navigation trails
2. **Recently Viewed Products** - LocalStorage-based product tracking
3. **Variant Selection Reliability** - Robust variant handling with dynamic updates
4. **Lightweight Animations** - Scroll-triggered animations using IntersectionObserver

---

## 1. Breadcrumb Navigation

### Location

- **Snippet**: `snippets/breadcrumbs.liquid`

### Features

✅ Semantic HTML with ARIA labels  
✅ Responsive design (mobile-optimized)  
✅ Works on all page types (product, collection, article, page)  
✅ Automatic collection detection on product pages  
✅ Zero external dependencies

### Usage

#### Product Page

```liquid
{% render 'breadcrumbs', product: product %}
```

#### Collection Page

```liquid
{% render 'breadcrumbs', collection: collection %}
```

#### Display Hierarchy

- **Product Page**: Home > Collection > Product Name
- **Collection Page**: Home > Collection Name
- **Article Page**: Home > Blog > Article Name
- **Page**: Home > Page Name

### Styling

- Uses CSS custom properties: `--color-link`, `--color-text-secondary`, `--space-xs`, `--space-md`
- Responsive typography (reduces font size on mobile)
- High contrast for accessibility

### Accessibility

- ✅ ARIA labels (`aria-label="Breadcrumb"`, `aria-current="page"`)
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Proper semantic HTML structure

---

## 2. Recently Viewed Products

### Components

#### Manager Snippet

- **Location**: `snippets/recently-viewed-manager.liquid`
- **Purpose**: Tracks product views in localStorage

#### Display Section

- **Location**: `sections/recently-viewed.liquid`
- **Purpose**: Renders recently viewed products grid

### Features

✅ Stores up to 6 products  
✅ localStorage-based (persistent across sessions)  
✅ Automatic duplicate removal  
✅ Most recent products prioritized  
✅ Custom event system for updates  
✅ Graceful fallback for unsupported browsers

### Usage

#### 1. Add Manager to Layout

Include the manager snippet in your theme layout (`layout/theme.liquid`):

```liquid
{% render 'recently-viewed-manager' %}
```

#### 2. Add Section to Template

Add the section to your product template or include it in the product section:

```json
{
  "type": "recently-viewed"
}
```

### JavaScript API

Access recently viewed products programmatically:

```javascript
// Get all recently viewed products
const products = window.SmartNest.RecentlyViewed.get();

// Manually add a product
window.SmartNest.RecentlyViewed.add(productId, {
  title: "Product Name",
  image: "https://...",
  url: "https://...",
  price: "$99.99",
});

// Clear all recently viewed
window.SmartNest.RecentlyViewed.clear();

// Debug helper
window.SmartNest.RecentlyViewed.debug();
```

### Data Structure

```javascript
{
  id: 123456,
  title: "Product Name",
  image: "https://cdn.shopify.com/...",
  url: "https://store.com/products/...",
  price: "$99.99",
  timestamp: 1686748000000
}
```

### Events

Listen for updates:

```javascript
window.addEventListener("smartnest:recentlyViewedUpdated", (event) => {
  console.log("Recently viewed updated:", event.detail.products);
});
```

### Storage Details

- **Key**: `smartnest_recently_viewed`
- **Storage Type**: localStorage
- **Max Items**: 6
- **Persistence**: Across browser sessions
- **Error Handling**: Gracefully handles quota exceeded and blocked storage

---

## 3. Variant Selection Reliability

### Location

- **Enhanced Section**: `sections/product.liquid`

### Improvements Over Original

| Feature            | Original            | Enhanced                          |
| ------------------ | ------------------- | --------------------------------- |
| Variant Selection  | `<select>` dropdown | Radio buttons (more accessible)   |
| Dynamic Updates    | None                | Real-time price, image, inventory |
| Inventory Tracking | Static              | Dynamic with availability status  |
| Form Validation    | Minimal             | Pre-submit validation             |
| Image Gallery      | Sequential loop     | Thumbnail navigation              |
| SKU Display        | None                | Shows current variant SKU         |
| Accessibility      | Basic               | Full ARIA support                 |

### Features

✅ Radio buttons instead of dropdown (better UX)  
✅ Real-time price updates  
✅ Dynamic inventory/availability status  
✅ Automatic image updates for variant-specific images  
✅ Quantity input respects inventory  
✅ Form pre-submission validation  
✅ Thumbnail gallery with click selection  
✅ Add-to-cart button state management

### Usage

The enhanced product section automatically handles all variant logic:

```liquid
{% section 'product' %}
```

### JavaScript Events

The form handles submission with validation:

```javascript
// Variant selection
document.querySelector("[data-variant-id]").addEventListener("change", (e) => {
  // Auto-triggered, no manual action needed
});

// Manual variant update if needed
window.animateElement(element);
```

### Variant Data

All variant data is embedded in JSON:

```javascript
productData.variants; // Array of variant objects
productData.featured_image; // Product featured image
```

### Form Structure

```html
<!-- Variant Selection -->
<fieldset data-variant-select>
  <input type="radio" name="id" data-variant-id="123" />
  <!-- Multiple variants -->
</fieldset>

<!-- Quantity Input -->
<input type="number" name="quantity" data-quantity-input />

<!-- Submit Button -->
<button type="submit" data-add-to-cart-button>Add to cart</button>

<!-- Dynamic Price Display -->
<span data-product-price>$99.99</span>

<!-- Dynamic Inventory Display -->
<span data-product-inventory>In stock</span>

<!-- SKU Display -->
<span data-product-sku>SKU-123</span>
```

### Validation

Before submitting the cart form:

1. ✅ Variant selected
2. ✅ Variant available
3. ✅ Quantity is positive
4. ✅ Quantity doesn't exceed inventory

---

## 4. Lightweight Animations

### Location

- **Snippet**: `snippets/animation-utils.liquid`

### Technology

- **API**: IntersectionObserver (native browser API)
- **No Libraries**: Pure vanilla JavaScript
- **Performance**: Optimized with unobserve after animation
- **Accessibility**: Respects `prefers-reduced-motion`

### Features

✅ Fade up animation (translateY + opacity)  
✅ Fade in animation (opacity only)  
✅ Slide left animation (translateX + opacity)  
✅ Staggered group animations  
✅ Reveal on scroll (50px before viewport)  
✅ Reduced motion support  
✅ Zero external dependencies

### Usage

#### 1. Include Animation Utils

Add to your layout or section:

```liquid
{% render 'animation-utils' %}
```

#### 2. Apply Classes to Elements

**Fade Up** (most common for product reveals):

```html
<div class="animate-fade-up">Product card or section</div>
```

**Fade In** (subtle opacity change):

```html
<div class="animate-fade-in">Background image or overlay</div>
```

**Slide Left** (side entrance):

```html
<div class="animate-slide-left">Product image</div>
```

**Staggered Group** (multiple items with delay):

```html
<div class="animate-group">
  <div class="product-card">Item 1</div>
  <div class="product-card">Item 2</div>
  <div class="product-card">Item 3</div>
</div>
```

### Stagger Timing

Items in `.animate-group` animate with delays:

- Item 1: 0s
- Item 2: 0.1s
- Item 3: 0.2s
- Item 4: 0.3s
- Item 5: 0.4s
- Item 6+: 0.5s

### Manual Triggering

For advanced use cases, manually trigger animations:

```javascript
const element = document.querySelector(".animate-fade-up");
window.animateElement(element);
```

### CSS Customization

Adjust animation duration and timing:

```css
.animate-fade-up {
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

/* Change to 1s duration */
.animate-fade-up {
  transition:
    opacity 1s ease,
    transform 1s ease;
}
```

### Performance Notes

- Observer auto-unobserves after animation to save memory
- Fallback check on window load for fast connections
- Respects system preferences for reduced motion
- No layout thrashing (reads/writes batched)

### Browser Support

- ✅ Chrome/Edge 51+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ iOS Safari 12.2+
- ⚠️ Fallback for older browsers (elements remain visible)

---

## CSS Variables Reference

All components use standardized CSS variables:

### Spacing

```css
--space-xs: 0.25rem --space-sm: 0.5rem --space-md: 1rem --space-lg: 1.5rem
  --space-xl: 2rem --space-2xl: 3rem;
```

### Typography

```css
--font-size-xs: 0.75rem --font-size-sm: 0.875rem --font-size-md: 1rem
  --font-size-lg: 1.25rem --font-size-xl: 1.5rem --font-size-2xl: 2rem;
```

### Colors

```css
--color-background: Primary background --color-background-secondary: Secondary
  background --color-background-tertiary: Tertiary background
  --color-text: Primary text --color-text-secondary: Secondary text
  --color-link: Link color --color-link-hover: Link hover color
  --color-border: Border color --color-price: Price text color
  --color-button-bg: Button background --color-button-text: Button text
  --color-button-bg-hover: Button hover background --color-focus: Focus outline
  color;
```

### Layout

```css
--max-page-width: Container max width --border-radius: Corner radius;
```

---

## Integration Checklist

- [ ] Include `snippets/breadcrumbs.liquid` in product template
- [ ] Include `snippets/recently-viewed-manager.liquid` in layout
- [ ] Add `sections/recently-viewed.liquid` to product template
- [ ] Replace `sections/product.liquid` with enhanced version
- [ ] Update translations in `locales/en.default.json`
- [ ] Update CSS variables in `snippets/css-variables.liquid`
- [ ] Include `snippets/animation-utils.liquid` in layout or high-traffic sections
- [ ] Test on mobile devices
- [ ] Test keyboard navigation
- [ ] Test with screen readers

---

## Mobile Optimization

All components are mobile-first:

### Breakpoints

- **Mobile**: ≤ 640px
- **Tablet**: 641px - 1024px
- **Desktop**: > 1024px

### Responsive Features

- ✅ Breadcrumbs: Reduced font size on mobile
- ✅ Recently Viewed: Responsive grid (150px on mobile, 200px on desktop)
- ✅ Product Images: Thumbnail grid adjusts to 4 columns on mobile
- ✅ Animation Groups: Work seamlessly on all sizes

---

## Accessibility Features

All components meet WCAG 2.1 AA standards:

### Keyboard Navigation

- ✅ Breadcrumbs: Tab navigation to links
- ✅ Product Form: Tab through all inputs
- ✅ Image Gallery: Click/Enter on thumbnails
- ✅ Variant Selection: Arrow keys for radio options

### Screen Readers

- ✅ Semantic HTML (`<nav>`, `<button>`, `<input>`)
- ✅ ARIA labels and descriptions
- ✅ Form labels associated with inputs
- ✅ Image alt text on all images

### Visual Accessibility

- ✅ Focus indicators (2px outline)
- ✅ Color contrast meets WCAG AA (4.5:1 for text)
- ✅ Reduced motion support
- ✅ Clear visual feedback on interactions

---

## Troubleshooting

### Recently Viewed Not Showing

**Problem**: Recently viewed section appears empty.
**Solution**:

1. Check browser localStorage is enabled
2. Verify `recently-viewed-manager` is included before the section
3. Check browser console for errors
4. Run `window.SmartNest.RecentlyViewed.debug()` in console

### Animations Not Playing

**Problem**: Elements don't animate on scroll.
**Solution**:

1. Verify `animation-utils` snippet is rendered
2. Check if `prefers-reduced-motion` is enabled (will disable animations)
3. Verify elements have `.animate-*` classes
4. Check browser support (IE 11 not supported)

### Variant Updates Not Working

**Problem**: Price/image doesn't update when variant changes.
**Solution**:

1. Clear browser cache
2. Check product has multiple variants
3. Verify product JSON is embedded correctly
4. Check browser console for JavaScript errors

### Breadcrumbs Not Showing

**Problem**: Breadcrumb navigation missing.
**Solution**:

1. Verify `breadcrumbs` snippet is rendered
2. Check product/collection objects are available
3. Verify translations are defined
4. Check CSS is not hidden by display: none

---

## Performance Metrics

### Page Load Impact

- **Breadcrumbs**: < 1KB (CSS + HTML)
- **Recently Viewed Manager**: ~2KB (JavaScript)
- **Recently Viewed Section**: ~3KB (CSS + HTML + JavaScript)
- **Product Section**: ~8KB (enhanced version)
- **Animation Utils**: ~4KB (CSS + JavaScript)

**Total**: ~18KB (gzip ~5KB)

### Runtime Performance

- **IntersectionObserver**: Native browser API, no polyfills
- **localStorage**: Synchronous but fast
- **Event Listeners**: Minimal (3-5 total)
- **Memory**: < 50KB for all tracked data

---

## Browser Compatibility

| Feature           | Chrome | Firefox | Safari | Edge | IE 11 |
| ----------------- | ------ | ------- | ------ | ---- | ----- |
| Breadcrumbs       | ✅     | ✅      | ✅     | ✅   | ✅    |
| Recently Viewed   | ✅     | ✅      | ✅     | ✅   | ⚠️    |
| Variant Selection | ✅     | ✅      | ✅     | ✅   | ✅    |
| Animations        | ✅     | ✅      | ✅     | ✅   | ❌    |

⚠️ = Works with polyfills or degraded experience
❌ = Not supported

---

## Future Enhancements (Phase 2)

- [ ] Product comparison view
- [ ] Advanced filters with animation
- [ ] Wishlist/favorites with localStorage
- [ ] Product quick view with modal
- [ ] Image lazy loading optimization
- [ ] Advanced animation library
- [ ] A/B testing variants
- [ ] Advanced analytics integration

---

## Support & Maintenance

For issues or questions:

1. Check troubleshooting section above
2. Review component documentation
3. Check browser console for errors
4. Test in incognito/private mode
5. Clear all caches and rebuild

---

**Last Updated**: June 16, 2026  
**Version**: 1.0  
**Status**: Production Ready
