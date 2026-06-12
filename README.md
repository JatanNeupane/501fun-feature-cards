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

- Replaces static PNG stat cards with semantic, editable HTML
- Matches the three card colours from the 501 Fun site: **green**, **magenta**, **blue**
- Includes a section-level CTA (“Get in touch”) below the cards
- Works without JavaScript — cards are visible even if JS fails
- Scroll entrance animation via native `IntersectionObserver` (optional enhancement)

---

## File structure

```
/
├── index.html        # Demo page + the module markup
├── css/
│   └── cards.css     # All styles, fully commented
├── js/
│   └── cards.js      # Scroll animation (IntersectionObserver)
└── README.md
```

---

## How to use in a CMS

Copy the `<section class="feature-cards">` block into your CMS template. Each `<article class="feature-card">` is one card. The CMS exposes these fields per card:

| HTML element | CMS field | Example value |
|--------------|-----------|---------------|
| `.card__prefix` | Lead-in text | `More than` |
| `.card__stat` | Stat / Figure | `6,000,000` |
| `.card__label` | Stat label | `delighted guests` |
| `.card__illustration` | Decorative SVG | Inline SVG markup |
| `data-theme` | Colour variant | `green` / `magenta` / `blue` |

Section-level fields:

| HTML element | CMS field | Example value |
|--------------|-----------|---------------|
| `.feature-cards__title` | Section heading | `Trusted by 1000 venues worldwide` |
| `.feature-cards__subtitle` | Subheading | `The numbers speak for themselves` |
| `.feature-cards__note` | Supporting copy | Footer paragraph |
| `.feature-cards__cta` + href | Section CTA | `Get in touch` |

No code changes are needed to update figures — just edit the text in your CMS admin panel.

### WordPress

```php
// functions.php
wp_enqueue_style('feature-cards', get_template_directory_uri() . '/css/cards.css');
wp_enqueue_script('feature-cards', get_template_directory_uri() . '/js/cards.js', [], null, true);
```

Then use ACF or native block attributes to populate `.card__stat`, `.card__label`, etc.

### Craft CMS

```twig
{% for card in entry.featureCards %}
  <article class="feature-card" data-theme="{{ card.theme }}">
    <div class="card__inner">
      <p class="card__prefix">{{ card.prefix }}</p>
      <p class="card__stat">{{ card.stat }}</p>
      <h3 class="card__label">{{ card.label }}</h3>
      {{ card.illustration|raw }}
    </div>
  </article>
{% endfor %}
```

### React / Next.js

Convert `cards.js` IntersectionObserver logic to a `useEffect()` hook. The HTML structure and CSS remain identical.

---

## Design decisions

**Vanilla HTML/CSS/JS** — The brief explicitly encourages this. No framework means zero build tooling, zero dependency updates, and files that drop into any environment unchanged.

**Matches the 501 Fun reference cards** — Content, colour palette, and layout follow the three stat cards shown in the interview task brief and on [501fun.com](https://www.501fun.com/).

**CSS custom properties for theming** — All colours, spacing, and type sizes live in `:root` as named tokens. Swapping a brand colour means editing one line.

**`data-theme` attribute for colour variants** — Keeps colour logic in CSS. Adding a fourth card colour requires one new CSS block — no JS changes.

**`auto-fit` + `minmax` CSS Grid** — The three-column layout adapts to any screen width. One grid declaration handles mobile, tablet, and desktop.

**`clamp()` for fluid type and spacing** — Font sizes and padding scale proportionally between viewport widths.

**Progressive enhancement for animation** — Cards are visible by default. JS adds entrance animation only when available. `IntersectionObserver` is native, performant, and degrades gracefully.

**Inline SVG illustrations** — Decorative line-art SVGs replace raster images. CMS can swap SVG markup or omit illustrations entirely (`aria-hidden="true"`).

---

## Accessibility

- Semantic `<section>`, `<article>`, `<h2>`, `<h3>` hierarchy
- `aria-labelledby` on the section links heading to content
- `aria-label` on stats for full screen-reader context (e.g. “Over 501 million”)
- Descriptive `aria-label` on section CTA
- `role="list"` / `role="listitem"` on the grid
- Skip link to main content
- Explicit `:focus-visible` ring on all interactive elements
- `@media (prefers-reduced-motion: reduce)` disables animation
- `@media (forced-colors: active)` adds visible borders in Windows High Contrast Mode
- `aria-hidden="true"` on decorative SVG illustrations

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
