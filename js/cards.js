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
  opacity:0 and translateY(24px). When a card enters the viewport, the observer adds the class
  .is-visible, which triggers the CSS transition to fade/slide in.
  The observer then disconnects from that card (observe once only).

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
   * Respect user's motion preference.
   * If prefers-reduced-motion is set, skip JS entirely — CSS
   * already makes cards visible without animation.
   */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Make all cards visible immediately (belt-and-suspenders
    // alongside the CSS @media rule).
    document.querySelectorAll('.feature-card').forEach(function (card) {
      card.classList.add('is-visible');
    });
    return; // No observer needed.
  }

  /**
   * Graceful degradation: if IntersectionObserver isn't supported
   * (very old browsers), show all cards immediately.
   */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.feature-card').forEach(function (card) {
      card.classList.add('is-visible');
    });
    return;
  }

  /**
   * Observer configuration:
   * threshold: 0.15 — trigger when 15% of the card is in view.
   * This feels natural on both mobile (smaller viewport) and
   * desktop without firing too early or too late.
   */
  var observerOptions = {
    threshold: 0.15
  };

  /**
   * The callback runs each time a card crosses the threshold.
   * We add .is-visible and immediately unobserve — the animation
   * only plays once (no re-triggering on scroll up/down).
   */
  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // fire-once, then done
      }
    });
  }, observerOptions);

  /**
   * Observe every feature card on the page.
   * If more cards are added dynamically (e.g. CMS loads new
   * content via AJAX), call observeCards() again after injection.
   */
  function observeCards() {
    document.querySelectorAll('.feature-card').forEach(function (card) {
      observer.observe(card);
    });
  }

  // Initialise on DOM ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeCards);
  } else {
    // DOM already parsed (script is defer'd, so this is typical).
    observeCards();
  }

  // Expose for CMS/AJAX: call again after dynamically injecting cards.
  window.observeFeatureCards = observeCards;

}());
