// Animation 1 — hero constellation network background.
import { debounce, randRange } from "../utils.js";

const MAX_DIST = 140;
const LINE_BASE_ALPHA = 0.25;

function nodeCountFor(width) {
  if (width < 768) return 25;
  if (width < 1200) return 40;
  return 60;
}

function createNodes(count, width, height) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: randRange(0, width),
      y: randRange(0, height),
      vx: randRange(-0.15, 0.15),
      vy: randRange(-0.15, 0.15),
      r: randRange(1, 2.5),
    });
  }
  return nodes;
}

export function init({ canvas, section, reducedMotion }) {
  if (!canvas || !section) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [];
  let rafId = null;
  let running = false;

  function resize() {
    const rect = section.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    nodes = createNodes(nodeCountFor(width), width, height);
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;
      node.x = Math.min(Math.max(node.x, 0), width);
      node.y = Math.min(Math.max(node.y, 0), height);

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(45, 212, 191, 0.55)";
      ctx.fill();
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * LINE_BASE_ALPHA;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(154, 165, 172, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (running) {
      rafId = requestAnimationFrame(step);
    }
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  resize();

  if (reducedMotion) {
    // Draw a single static frame and never animate.
    step();
    running = false;
  }

  window.addEventListener(
    "resize",
    debounce(() => {
      resize();
      if (reducedMotion) step();
    }, 150)
  );

  if (!reducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
          } else {
            stop();
          }
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(section);
  }
}
