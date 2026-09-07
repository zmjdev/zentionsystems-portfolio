import { $, $$, prefersReducedMotion } from "./utils.js";
import { init as initHeroNetwork } from "./animations/hero-network.js";
import { init as initScrollReveal } from "./animations/scroll-reveal.js";
import { init as initStackDiagram } from "./animations/stack-diagram.js";

function initNavToggle() {
  const header = $(".site-header");
  const toggle = $(".nav-toggle");
  const nav = $(".main-nav");
  if (!header || !toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.dataset.navOpen === "true";
    header.dataset.navOpen = String(!isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  $$(".nav-link", nav).forEach((link) => {
    link.addEventListener("click", () => {
      header.dataset.navOpen = "false";
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initActiveNavTracking() {
  const links = $$(".nav-link[href^='#']");
  if (!links.length) return;

  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.find(
          (l) => l.getAttribute("href") === `#${entry.target.id}`
        );
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-current"));
          link.classList.add("is-current");
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function initContactForm() {
  const form = $(".form");
  if (!form) return;
  const status = $(".form-status", form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // TODO: wire up a real backend submission handler (API endpoint / email
    // service). For now this only confirms client-side that the form works.
    if (status) {
      status.textContent = "Thanks — we'll be in touch shortly.";
      status.hidden = false;
    }
    form.reset();
  });
}

function initHeroNetworkIfPresent(reducedMotion) {
  const canvas = $(".hero-canvas");
  const section = $(".hero");
  if (!canvas || !section) return;
  initHeroNetwork({ canvas, section, reducedMotion });
}

function initStackDiagramIfPresent(reducedMotion) {
  const svg = $(".stack-diagram");
  const section = $("#tech-stack");
  if (!svg || !section) return;
  initStackDiagram({ svg, section, reducedMotion });
}

function init() {
  const reducedMotion = prefersReducedMotion();

  initNavToggle();
  initActiveNavTracking();
  initContactForm();

  initScrollReveal({ reducedMotion });
  initHeroNetworkIfPresent(reducedMotion);
  initStackDiagramIfPresent(reducedMotion);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
