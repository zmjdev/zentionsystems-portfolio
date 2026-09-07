// Small shared helpers used across main.js and the animation modules.

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const lerp = (a, b, t) => a + (b - a) * t;

export const randRange = (min, max) => min + Math.random() * (max - min);

export function debounce(fn, ms = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Computed once by main.js and threaded into every animation module's
// init() so all three respect a single, consistent decision.
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
