# SmartNest Phase 1 - Implementation Examples

## Complete Example Implementations

### Example 1: Product Page with All Features

**File**: `templates/product.json`

```json
{
  "sections": {
    "main": {
      "type": "product",
      "settings": {}
    },
    "recently-viewed": {
      "type": "recently-viewed",
      "settings": {}
    }
  },
  "order": ["main", "recently-viewed"]
}
```

---

### Example 2: Layout with All Utilities

**File**: `layout/theme.liquid` (partial)

```liquid
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS Variables (includes all design tokens) -->
    {% render 'css-variables' %}

    {% comment %} Other head content {% endcomment %}
  </head>

  <body>
    <!-- Header and main navigation -->
    {% section 'header' %}

    <!-- Main content -->
    <main id="MainContent" class="content">
      {{ content_for_layout }}
    </main>

    <!-- Footer -->
    {% section 'footer' %}

    <!-- Product tracking (loads before animations) -->
    {% render 'recently-viewed-manager' %}

    <!-- Animation utilities (enables scroll animations) -->
    {% render 'animation-utils' %}

    {% comment %} Shopify scripts {% endcomment %}
    {{ content_for_header }}
  </body>
</html>
```

---

### Example 3: Enhanced Product Section Usage

**In section**: `sections/product.liquid` (already included)

The section automatically provides:

```liquid
<!-- Breadcrumbs (at top) -->
{% render 'breadcrumbs', product: product %}

<!-- Main product display with variant handling -->
<form data-product-form>
  <!-- Variant selection with real-time updates -->
  <input type="radio" name="id" data-variant-id="{{ variant.id }}" />

  <!-- Dynamic price display -->
  <span data-product-price>{{ variant.price | money }}</span>

  <!-- Dynamic inventory display -->
  <span data-product-inventory>In stock</span>
</form>
```

---

### Example 4: Using Animations in Sections

**File**: `sections/custom-section.liquid` (example)

```liquid
<div class="custom-section">
  <!-- Main heading with fade-in -->
  <h2 class="animate-fade-in">
    {{ section.settings.heading }}
  </h2>

  <!-- Description with slide-left animation -->
  <p class="animate-slide-left">
    {{ section.settings.description }}
  </p>

  <!-- Product grid with staggered animations -->
  <div class="product-grid animate-group">
    {% for product in collection.products %}
      <div class="product-card animate-fade-up">
        {% render 'product-card', product: product %}
      </div>
    {% endfor %}
  </div>
</div>

{% stylesheet %}
  .custom-section {
    padding: var(--space-lg);
  }

  .custom-section h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-md);
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .product-card {
    border-radius: var(--border-radius);
    overflow: hidden;
    background-color: var(--color-background-secondary);
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Featured Collection"
    },
    {
      "type": "text",
      "id": "description",
      "label": "Description",
      "default": "Check out our latest products"
    }
  ]
}
{% endschema %}
```

---

### Example 5: Recently Viewed Products Display

**File**: `sections/recently-viewed.liquid` (provided)

Automatically:

```javascript
// On product page, tracks the product:
window.SmartNest.RecentlyViewed.add(productId, {
  title: "Product Name",
  image: "https://cdn.shopify.com/...",
  url: "https://store.com/products/...",
  price: "$99.99",
});

// Section automatically displays recently viewed
// (excluding current product on product pages)
```

---

### Example 6: Breadcrumb Implementation

**File**: `sections/product.liquid`

```liquid
<!-- Include breadcrumbs (already in enhanced version) -->
{% render 'breadcrumbs', product: product %}

<!-- Results in: Home > Electronics > Smart Watch -->
```

---

### Example 7: Product Card with Animations

**File**: `snippets/product-card.liquid` (example)

```liquid
{% doc %}
  Renders a product card with animation support.

  @param {product} product - Product object

  @example
  {% render 'product-card', product: product %}
{% enddoc %}

<a href="{{ product.url }}" class="product-card animate-fade-up">
  <div class="product-card__image">
    <img
      src="{{ product.featured_image | image_url: width: 300 }}"
      alt="{{ product.featured_image.alt }}"
      loading="lazy"
    >
  </div>

  <div class="product-card__content">
    <h3 class="product-card__title">
      {{ product.title }}
    </h3>

    <div class="product-card__price">
      {{ product.price_min | money }}
      {% if product.price_max != product.price_min %}
        - {{ product.price_max | money }}
      {% endif %}
    </div>

    {% if product.available %}
      <span class="product-card__availability">
        {{ 'product.available' | t }}
      </span>
    {% else %}
      <span class="product-card__availability product-card__availability--sold">
        {{ 'product.sold_out' | t }}
      </span>
    {% endif %}
  </div>
</a>

{% stylesheet %}
  .product-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-sm);
    text-decoration: none;
    color: var(--color-text);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    transition: box-shadow 0.2s ease;
  }

  .product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .product-card__image {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--border-radius);
    background-color: var(--color-background-secondary);
  }

  .product-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-card__title {
    font-weight: 600;
    font-size: var(--font-size-sm);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-card__price {
    font-weight: 700;
    color: var(--color-price);
    font-size: var(--font-size-md);
  }

  .product-card__availability {
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--border-radius);
    background-color: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }

  .product-card__availability--sold {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
{% endstylesheet %}
```

---

### Example 8: Collection Grid with Animations

**File**: `sections/collection-grid.liquid` (example)

```liquid
<section class="collection-grid">
  <h1 class="collection-grid__title animate-fade-in">
    {{ collection.title }}
  </h1>

  <div class="collection-grid__filters animate-slide-left">
    {% comment %} Filter options here {% endcomment %}
  </div>

  <div class="collection-grid__products animate-group">
    {% for product in collection.products %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>

  {% if paginate.next %}
    <div class="collection-grid__pagination">
      <a href="{{ paginate.next.url }}" class="button animate-fade-up">
        {{ 'pagination.next' | t }}
      </a>
    </div>
  {% endif %}
</section>

{% stylesheet %}
  .collection-grid {
    padding: var(--space-lg);
    max-width: var(--max-page-width);
    margin: 0 auto;
  }

  .collection-grid__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-lg);
  }

  .collection-grid__filters {
    margin-bottom: var(--space-lg);
  }

  .collection-grid__products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .collection-grid__pagination {
    text-align: center;
  }

  @media (max-width: 768px) {
    .collection-grid {
      padding: var(--space-md);
    }

    .collection-grid__products {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--space-sm);
    }
  }
{% endstylesheet %}
```

---

### Example 9: Using Recently Viewed API

**Custom JavaScript (if needed)**:

```javascript
// Get recently viewed products
const recentProducts = window.SmartNest.RecentlyViewed.get();

console.log("Recently viewed products:", recentProducts);
// Output:
// [
//   {
//     id: 123456,
//     title: "Product 1",
//     image: "https://...",
//     url: "https://...",
//     price: "$99.99",
//     timestamp: 1686748000000
//   },
//   ...
// ]

// Manually add a product (usually automatic)
window.SmartNest.RecentlyViewed.add(789, {
  title: "Manual Product",
  image: "https://...",
  url: "https://...",
  price: "$49.99",
});

// Listen for updates
window.addEventListener("smartnest:recentlyViewedUpdated", (event) => {
  const updatedProducts = event.detail.products;
  console.log("Products updated:", updatedProducts);

  // Update custom UI
  updateRecentlyViewedUI(updatedProducts);
});

// Clear all recently viewed
window.SmartNest.RecentlyViewed.clear();

// Debug
window.SmartNest.RecentlyViewed.debug();
```

---

### Example 10: Mobile-First Responsive Section

**File**: `sections/hero-with-animation.liquid` (example)

```liquid
<section class="hero">
  <div class="hero__background">
    <img
      src="{{ section.settings.image | image_url: width: 1200 }}"
      alt="{{ section.settings.image_alt }}"
      class="animate-fade-in"
      loading="eager"
    >
  </div>

  <div class="hero__content">
    <h1 class="hero__title animate-fade-up">
      {{ section.settings.title }}
    </h1>

    <p class="hero__subtitle animate-fade-up">
      {{ section.settings.subtitle }}
    </p>

    <a href="{{ section.settings.button_url }}" class="button animate-fade-up">
      {{ section.settings.button_text }}
    </a>
  </div>
</section>

{% stylesheet %}
  .hero {
    position: relative;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .hero__background {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }

  .hero__background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero__content {
    text-align: center;
    color: white;
    z-index: 1;
    padding: var(--space-lg);
    max-width: 600px;
  }

  .hero__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-md);
    font-weight: 700;
  }

  .hero__subtitle {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-lg);
    opacity: 0.95;
  }

  .button {
    display: inline-block;
    padding: var(--space-sm) var(--space-lg);
    background-color: var(--color-button-bg);
    color: var(--color-button-text);
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease;
  }

  .button:hover {
    background-color: var(--color-button-bg-hover);
  }

  @media (max-width: 768px) {
    .hero {
      height: 300px;
    }

    .hero__title {
      font-size: var(--font-size-xl);
    }

    .hero__subtitle {
      font-size: var(--font-size-md);
    }

    .hero__content {
      padding: var(--space-md);
    }
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Hero with Animation",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background Image"
    },
    {
      "type": "text",
      "id": "image_alt",
      "label": "Image Alt Text",
      "default": "Hero background"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Welcome to Our Store"
    },
    {
      "type": "text",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "Discover amazing products"
    },
    {
      "type": "url",
      "id": "button_url",
      "label": "Button URL"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Shop Now"
    }
  ]
}
{% endschema %}
```

---

## Testing Scenarios

### Test Scenario 1: Product Page Flow

```gherkin
Feature: Product Page with SmartNest Phase 1

Scenario: User visits product page
  Given User visits product page
  Then Breadcrumbs display: Home > Collection > Product
  And Recently Viewed Manager tracks the product
  And Variant selection shows radio buttons
  And Product has fade-in animation
  And Images fade-up on scroll

Scenario: User changes variant
  Given Product has multiple variants
  When User selects different variant
  Then Price updates dynamically
  And Availability status updates
  Then Main image changes if variant-specific
  And Quantity max updates to variant inventory
```

### Test Scenario 2: Recently Viewed

```gherkin
Feature: Recently Viewed Products

Scenario: Track product views
  Given User is logged out (using localStorage)
  When User visits 3 products
  Then Recently viewed section shows 3 products
  And Products show in reverse chronological order
  And localStorage contains product data

Scenario: Limit to 6 products
  Given User has viewed 10 products
  When Recently viewed section loads
  Then Only latest 6 products display
  And Oldest products are removed from localStorage
```

### Test Scenario 3: Animations

```gherkin
Feature: Scroll Animations

Scenario: Elements animate on scroll
  Given Page with animate-fade-up classes
  When User scrolls page down
  Then Elements fade up as they enter viewport
  And Staggered items have delays
  And Animation completes in 0.6s

Scenario: Respect reduced motion
  Given User has prefers-reduced-motion enabled
  When Page loads with animations
  Then Elements display immediately
  And No animations play
```

---

## Deployment Checklist

- [ ] All new snippets created
- [ ] Enhanced product.liquid deployed
- [ ] Translations updated
- [ ] CSS variables updated
- [ ] Layout includes all utilities
- [ ] Recently viewed section added to templates
- [ ] Testing completed on all devices
- [ ] Accessibility verified
- [ ] Browser compatibility confirmed
- [ ] Performance metrics acceptable
- [ ] Analytics ready for phase 1

---

**Ready for Production** ✅
