// Animation 3 — interactive layered tech stack diagram.
import { $$ } from "../utils.js";

export function init({ svg, section, reducedMotion }) {
  if (!svg || !section) return;

  const connectors = $$(".connector-path", svg);
  const layers = $$(".stack-layer", svg);

  // Prime each connector: measure its real length, then hide it by offsetting
  // the dash exactly that far. getTotalLength() requires the SVG to already
  // be attached and in normal flow (not display:none) — safe here since it's
  // rendered inline. A fixed viewBox means the length is stable, so this is
  // computed once and never recalculated on resize.
  connectors.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = reducedMotion ? "0" : String(length);
  });

  function draw() {
    connectors.forEach((path) => {
      path.style.strokeDashoffset = "0";
    });
  }

  if (reducedMotion) {
    draw();
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            draw();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
  }

  // Hover/focus interaction — independent of the motion preference, since
  // this is interaction feedback, not motion-on-load.
  function setActive(activeLayer) {
    layers.forEach((layer) => {
      if (layer === activeLayer) {
        layer.classList.add("is-active");
        layer.classList.remove("is-dimmed");
      } else {
        layer.classList.remove("is-active");
        layer.classList.add("is-dimmed");
      }
    });
  }

  function clearActive() {
    layers.forEach((layer) => {
      layer.classList.remove("is-active", "is-dimmed");
    });
  }

  layers.forEach((layer) => {
    layer.addEventListener("mouseenter", () => setActive(layer));
    layer.addEventListener("mouseleave", clearActive);
    layer.addEventListener("focus", () => setActive(layer));
    layer.addEventListener("blur", clearActive);
  });
}
