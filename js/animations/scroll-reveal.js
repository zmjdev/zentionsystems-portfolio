// Animation 2 — scroll-triggered reveals + stat count-up.
import { $$, easeOutCubic } from "../utils.js";

function animateCounter(el) {
  const target = Number(el.dataset.target || 0);
  const duration = 1200;
  let start = null;

  function frame(timestamp) {
    if (start === null) start = timestamp;
    const elapsed = timestamp - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);
    el.textContent = Math.floor(eased * target).toString();

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = target.toString();
    }
  }

  requestAnimationFrame(frame);
}

export function init({ reducedMotion }) {
  const revealTargets = $$("[data-reveal]");
  const counterTargets = $$("[data-counter]");

  if (reducedMotion) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
    counterTargets.forEach((el) => {
      el.textContent = (el.dataset.target || "0").toString();
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  counterTargets.forEach((el) => counterObserver.observe(el));
}
