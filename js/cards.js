/*
  ================================================================
  501 Fun — Feature Cards Module
  cards.js

  PURPOSE:
  Adds scroll-triggered entrance animations to .feature-card
  elements using the native IntersectionObserver API.

  WHY INTERSECTIONOBSERVER?
  ─────────────────────────
  • Zero dependencies — no library needed.
  • No scroll event listeners — highly performant (runs off the
    main thread, browser-managed).
  • Supported in all modern browsers (Chrome 51+, Firefox 55+,
    Safari 12.1+). Degrades gracefully: if unavailable, cards are
    shown immediately via the CSS fallback.

  HOW IT WORKS:
  ─────────────
  Cards start hidden only when JS is available (.js on <html>):
  opacity:0 and translateY(24px). When a card enters the viewport,
  the observer adds .is-visible, which triggers the CSS transition
  to fade/slide in. will-change is cleared after animation to free
  GPU memory. The observer then disconnects from that card (once).

  CMS / FRAMEWORK INTEGRATION NOTE:
  ──────────────────────────────────
  This file is vanilla JS with no build step required. To use in:
  • WordPress:   enqueue via wp_enqueue_script() in functions.php
  • Craft CMS:   include via {% js %} tag or Vite asset pipeline
  • React/Vue:   convert to a useEffect() hook or Vue mounted()
                 lifecycle — logic is identical, just wrapped.
  ================================================================
*/

(function () {
  'use strict';

  /**
   * Mark a card visible and release GPU layer after entrance.
   */
  function revealCard(card) {
    card.classList.add('is-visible');
    card.style.willChange = 'auto';
  }

  /**
   * Respect user's motion preference.
   * If prefers-reduced-motion is set, skip JS entirely — CSS
   * already makes cards visible without animation.
   */
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.feature-card').forEach(revealCard);
    return;
  }

  /**
   * Graceful degradation: if IntersectionObserver isn't supported
   * (very old browsers), show all cards immediately.
   */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.feature-card').forEach(revealCard);
    return;
  }

  var observerOptions = {
    threshold: 0.15
  };

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        revealCard(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function observeCards() {
    document.querySelectorAll('.feature-card').forEach(function (card) {
      observer.observe(card);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeCards);
  } else {
    observeCards();
  }

  window.observeFeatureCards = observeCards;

}());
