// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Pixel art ----------
// Each string is one row of pixels; each letter is a color from the palette.
const PALETTE = {
  O: "#3b2416", // outline
  B: "#9a6b45", // fur
  D: "#74502f", // darker fur (ears, paws)
  C: "#f3dfc1", // cream face and belly
  E: "#1c1917", // eye
  W: "#ffffff", // eye sparkle
  N: "#3b2416", // nose
  M: "#c0504a", // mouth
  P: "#f2a0a0", // blush
  K: "#e9dcc9", // whiskers
  S: "#f4a261", // clam
  s: "#c76b2a", // clam ridges
  R: "#e5484d", // heart
  r: "#ff9da0", // heart shine
};

const OTTER = [
  ".....OOO........OOO.....",
  "....ODDBOOOOOOOOBDDO....",
  "....OBBBBBBBBBBBBBBO....",
  "...OBBBBBBBBBBBBBBBBO...",
  "..OBBBBBBBBBBBBBBBBBBO..",
  "..OBBBWEBBBBBBBBWEBBBO..",
  "..OBBBEEBCCCCCCBEEBBBO..",
  "KKOBBPPBCCCNNCCCBPPBBOKK",
  ".KOBBBBCCCCMMCCCCBBBBOK.",
  "...OBBBCCCCCCCCCCBBBO...",
  "....OBBBCCCCCCCCBBBO....",
  "...OBBBBCCCCCCCCBBBBO...",
  "..OBBBDDCCSSSSCCDDBBBO..",
  "..OBBDDBCSsSSsSCBDDBBO..",
  "..OBBBBBCCSsSsCCBBBBBO..",
  "..OBBBBBCCCCCCCCBBBBBO..",
  "..OBBBBBCCCCCCCCBBBBBO..",
  "..OBBBBBCCCCCCCCBBBBBO..",
];

const HEART = [
  ".RR.RR.",
  "RrRRRRR",
  "RRRRRRR",
  ".RRRRR.",
  "..RRR..",
  "...R...",
];

// Turn a sprite into SVG squares
function drawPixels(svg, rows) {
  const ns = "http://www.w3.org/2000/svg";
  svg.setAttribute("viewBox", `0 0 ${rows[0].length} ${rows.length}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (!PALETTE[ch]) return;
      const px = document.createElementNS(ns, "rect");
      px.setAttribute("x", x);
      px.setAttribute("y", y);
      px.setAttribute("width", 1.02); // tiny overlap hides hairline gaps
      px.setAttribute("height", 1.02);
      px.setAttribute("fill", PALETTE[ch]);
      svg.appendChild(px);
    });
  });
  return svg;
}

function pixelSprite(rows, className) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  return drawPixels(svg, rows);
}

drawPixels(document.getElementById("otter"), OTTER);

// ---------- Typewriter tagline ----------
const phrases = [
  "UX designer.",
  "Illustrator.",
  "Watercolor painter.",
  "Professional otter counter. 🦦",
];
const typed = document.getElementById("typed");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  typed.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex < phrase.length) {
    charIndex++;
    setTimeout(typeLoop, 80);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1600); // pause on the full phrase
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 40);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 300);
  }
}
if (reduceMotion) typed.textContent = phrases.join(" ");
else typeLoop();

// ---------- Bubbles ----------
const bubbles = document.querySelector(".bubbles");

function makeBubble(x) {
  const b = document.createElement("span");
  const size = 6 + Math.random() * 22;
  b.className = "bubble";
  b.style.width = b.style.height = size + "px";
  b.style.left = (x ?? Math.random() * 100) + "%";
  b.style.animationDuration = 6 + Math.random() * 8 + "s";
  bubbles.appendChild(b);
  b.addEventListener("animationend", () => b.remove());
}
if (!reduceMotion) setInterval(makeBubble, 450);

// ---------- Click the otter ----------
const otter = document.getElementById("otter");
otter.addEventListener("click", () => {
  otter.classList.remove("hop");
  void otter.offsetWidth; // restart the animation
  otter.classList.add("hop");
  const rect = otter.getBoundingClientRect();
  const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
  for (let i = 0; i < 8; i++) setTimeout(() => makeBubble(x + (Math.random() * 10 - 5)), i * 60);

  // Pixel hearts float up from the otter
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      const h = pixelSprite(HEART, "pixel-heart");
      h.style.left = rect.left + rect.width * (0.15 + Math.random() * 0.7) + "px";
      h.style.top = rect.top + window.scrollY + "px";
      document.body.appendChild(h);
      h.addEventListener("animationend", () => h.remove());
    }, i * 150);
  }
});

// ---------- Day / night toggle ----------
const root = document.documentElement;
function setTheme(theme) {
  root.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
const prefersNight = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(saved || (prefersNight ? "night" : "day"));

document.getElementById("theme-toggle").addEventListener("click", () => {
  setTheme(root.dataset.theme === "night" ? "day" : "night");
});

// ---------- Reveal sections on scroll ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- Easter egg: type "otter" ----------
let buffer = "";
window.addEventListener("keydown", (e) => {
  buffer = (buffer + e.key.toLowerCase()).slice(-5);
  if (buffer === "otter") {
    buffer = "";
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const s = pixelSprite(OTTER, "swimmer");
        s.style.top = 10 + Math.random() * 75 + "vh";
        s.style.animationDuration = 4 + Math.random() * 3 + "s";
        document.body.appendChild(s);
        s.addEventListener("animationend", () => s.remove());
      }, i * 350);
    }
  }
});

// ---------- Darken the header once we're past the hero ----------
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.7);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
