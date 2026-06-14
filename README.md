# 501 Fun – Feature Cards Module

A reusable, accessible, CMS-agnostic Feature Cards / CTA component built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step required.

This module replaces the three **image-based stat cards** on the [501fun.com](https://www.501fun.com/) homepage (“The numbers speak for themselves”) with editable HTML. Figures such as **6,000,000 delighted guests**, **45 countries**, and **501,000,000 darts thrown** can be updated in a CMS without a designer re-exporting images.

---

## Submission links

| Item | Link |
|------|------|
| **GitHub repository** | [github.com/JatanNeupane/501fun-feature-cards](https://github.com/JatanNeupane/501fun-feature-cards) |
| **Live demo** | [jatanneupane.github.io/501fun-feature-cards](https://jatanneupane.github.io/501fun-feature-cards/) |

---

## What it does

- Three **separate coloured cards** (red, blue, yellow) — each its own independent block
- Each card has its own **CTA button** with a unique accessible label
- Any single card can be copied and dropped anywhere on its own
- Works without JavaScript — cards stay visible via `<noscript>` + CSS fallback
- Optional scroll entrance animation via native `IntersectionObserver`

---

## File structure

```
/
├── index.html        # Demo page + the module markup
├── css/
│   └── cards.css     # All styles, fully commented
├── js/
│   └── cards.js      # Scroll animation (IntersectionObserver)
├── deploy.sh         # GitHub Pages deploy helper
└── README.md
```

---

## Methodology — why vanilla HTML, CSS & JS?

The interview brief explicitly encourages vanilla HTML, CSS, and native browser APIs. This approach was chosen because:

1. **Zero build step** — the module drops into WordPress, Craft, HubSpot, or any static host unchanged.
2. **Zero dependencies** — no npm packages to maintain, no framework version drift.
3. **CMS-friendly** — editors update plain text fields; no JSX or component compilation required.
4. **Longevity** — HTML and CSS outlive framework churn; a marketing module should survive years of CMS migrations.
5. **Performance** — no JS bundle to download; animation uses `IntersectionObserver` (browser-managed, off the main thread).

---

## The `data-theme` attribute system

Each card declares its colour via a single HTML attribute:

```html
<article class="feature-card" data-theme="red">…</article>
<article class="feature-card" data-theme="blue">…</article>
<article class="feature-card" data-theme="yellow">…</article>
```

CSS maps each value to a palette token in `:root`:

```css
[data-theme="red"]   .card__inner { background: var(--color-red);   color: var(--color-red-text);   }
[data-theme="blue"]  .card__inner { background: var(--color-blue);  color: var(--color-blue-text);  }
[data-theme="yellow"] .card__inner { background: var(--color-yellow); color: var(--color-yellow-text); }
```

**Adding a fourth colour** requires one new CSS block and one new token — no JavaScript changes.

The colour logic lives entirely in CSS, keeping presentation separate from CMS content fields.

---

## Modular usage — one card on its own

Each `<article class="feature-card">` is fully self-contained. Copy a single card anywhere:

```html
<link rel="stylesheet" href="css/cards.css" />

<article class="feature-card" data-theme="blue">
  <div class="card__inner">
    <p class="card__prefix">Find us in</p>
    <p class="card__stat">45</p>
    <h3 class="card__label">countries</h3>
    <a href="/venues" class="card__cta" aria-label="Explore the countries where 501 Fun operates">
      Explore Venues
    </a>
  </div>
</article>

<script src="js/cards.js" defer></script>
```

No section wrapper, grid, or sibling cards are required.

---

## How a CMS injects content

### Per-card fields

| HTML element | CMS field | Example value |
|--------------|-----------|---------------|
| `data-theme` | Colour variant | `red` / `blue` / `yellow` |
| `.card__prefix` | Lead-in text | `More than` |
| `.card__stat` | Stat / figure | `6,000,000` |
| `.card__label` | Stat label | `delighted guests` |
| `.card__illustration` | Decorative SVG | Inline SVG markup |
| `.card__cta` + `href` | Button label + URL | `Learn More` → `/events` |

### WordPress (ACF repeater example)

```php
// functions.php
wp_enqueue_style('feature-cards', get_template_directory_uri() . '/css/cards.css');
wp_enqueue_script('feature-cards', get_template_directory_uri() . '/js/cards.js', [], null, true);
```

```php
<section class="feature-cards" aria-labelledby="feature-cards-heading">
  <h2 id="feature-cards-heading"><?php the_field('section_heading'); ?></h2>
  <ul class="feature-cards__grid">
    <?php while (have_rows('feature_cards')) : the_row(); ?>
      <li class="feature-cards__item">
        <article class="feature-card" data-theme="<?php the_sub_field('theme'); ?>">
          <div class="card__inner">
            <p class="card__prefix"><?php the_sub_field('prefix'); ?></p>
            <p class="card__stat"><?php the_sub_field('stat'); ?></p>
            <h3 class="card__label"><?php the_sub_field('label'); ?></h3>
            <a href="<?php the_sub_field('cta_url'); ?>"
               class="card__cta"
               aria-label="<?php the_sub_field('cta_aria_label'); ?>">
              <?php the_sub_field('cta_label'); ?>
            </a>
          </div>
        </article>
      </li>
    <?php endwhile; ?>
  </ul>
</section>
```

### Craft CMS

```twig
<section class="feature-cards" aria-labelledby="feature-cards-heading">
  <h2 id="feature-cards-heading">{{ entry.sectionHeading }}</h2>
  <ul class="feature-cards__grid">
    {% for card in entry.featureCards %}
      <li class="feature-cards__item">
        <article class="feature-card" data-theme="{{ card.theme }}">
          <div class="card__inner">
            <p class="card__prefix">{{ card.prefix }}</p>
            <p class="card__stat">{{ card.stat }}</p>
            <h3 class="card__label">{{ card.label }}</h3>
            {% if card.illustration|length %}
              <div class="card__illustration" aria-hidden="true">{{ card.illustration|raw }}</div>
            {% endif %}
            <a href="{{ card.ctaUrl }}"
               class="card__cta"
               aria-label="{{ card.ctaAriaLabel }}">
              {{ card.ctaLabel }}
            </a>
          </div>
        </article>
      </li>
    {% endfor %}
  </ul>
</section>
```

No code changes are needed to update figures — editors change text fields in the CMS admin.

---

## Accessibility decisions

| Decision | Reason |
|----------|--------|
| `aria-labelledby` on `<section>` | Links the landmark to its visible heading for screen readers |
| Unique `aria-label` on each CTA | Avoids “Learn more, Learn more, Learn more” repetition |
| `<ul>` / `<li>` for the card grid | Native list semantics without ARIA role overrides |
| Skip link as first `<body>` child | Keyboard users bypass the demo header instantly |
| `<noscript>` + `.js` progressive enhancement | Cards always visible when JS fails or is disabled |
| `:focus-visible` rings on all links/buttons | Clear keyboard focus without mouse-click outlines |
| `prefers-reduced-motion` | Disables entrance animation and hover transforms |
| `forced-colors: active` | Visible borders in Windows High Contrast Mode |
| `aria-hidden="true"` on SVG illustrations | Decorative art excluded from the accessibility tree |
| `will-change` cleared after animation | Frees GPU memory once entrance completes |

---

## Design decisions

**CSS custom properties for theming** — All colours, spacing, and type sizes live in `:root`. Swapping a brand colour means editing one line.

**`auto-fit` + `minmax` CSS Grid** — Three columns on desktop, stacks on mobile, no per-breakpoint column rules.

**`clamp()` for fluid type** — Stat figures scale between viewport widths; long numbers (501,000,000) use a smaller token.

**Per-property transition delays** — Entrance stagger applies only to `opacity`/`transform`; `box-shadow` hover lift has 0ms delay for instant feedback.

**Inline SVG illustrations** — Replace raster PNGs; CMS can swap or omit them entirely.

---

## Browser support

| Feature | Support |
|---------|---------|
| CSS Grid | All modern browsers |
| CSS custom properties | All modern browsers |
| `clamp()` | Chrome 79+, Firefox 75+, Safari 13.1+ |
| IntersectionObserver | Chrome 51+, Firefox 55+, Safari 12.1+ |
| No-JS fallback | Cards visible without JavaScript |

---

## Portfolio

Sites I have worked on:

- [prodatamg.com](https://prodatamg.com)
- [point-star.com](https://point-star.com)
- [addictivewellness.com](https://addictivewellness.com)
- [tashtego.co](https://tashtego.co)
