// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SVG_NS = "http://www.w3.org/2000/svg";

// =====================================================================
// Pixel art
// Each string is one row of pixels; each letter is a color below.
// "." means empty. Change letters to redraw a character!
// =====================================================================
const PALETTE = {
  O: "#3b2416", // outline
  B: "#9a6b45", // fur
  D: "#74502f", // darker fur (ears, paws)
  C: "#f3dfc1", // cream face and belly
  E: "#1c1917", // eye
  W: "#ffffff", // white
  N: "#3b2416", // nose
  M: "#c0504a", // mouth
  P: "#f2a0a0", // blush
  K: "#e9dcc9", // whiskers
  S: "#f4a261", // clam / shell
  s: "#c76b2a", // clam ridges
  R: "#e5484d", // heart red
  r: "#ff9da0", // heart shine
  b: "#4f8fd8", // pup's scarf
  Y: "#ffd84a", // sunshine / sparkle / beak
  G: "#b8c4cc", // gull wing shade
  L: "#ffffff", // cloud
  l: "#d8eefa", // cloud shadow
  m: "#f5e7a1", // moon
  T: "#e8c48a", // palette wood
  g: "#5cb85c", // green paint
};

const SPRITES = {
  otter: [
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
  ],

  // Same otter, but with happy ^ ^ eyes, hugging a heart
  heartOtter: [
    ".....OOO........OOO.....",
    "....ODDBOOOOOOOOBDDO....",
    "....OBBBBBBBBBBBBBBO....",
    "...OBBBBBBBBBBBBBBBBO...",
    "..OBBBBBBBBBBBBBBBBBBO..",
    "..OBBBBEBBBBBBBBEBBBBO..",
    "..OBBBEBECCCCCCEBEBBBO..",
    "KKOBBPPBCCCNNCCCBPPBBOKK",
    ".KOBBBBCCCCMMCCCCBBBBOK.",
    "...OBBBCCCCCCCCCCBBBO...",
    "....OBBBCCCCCCCCBBBO....",
    "...OBBBBCCCCCCCCBBBBO...",
    "..OBBBDDCRRCCRRCDDBBBO..",
    "..OBBDDBCRrRRRRCBDDBBO..",
    "..OBBBBBCCRRRRCCBBBBBO..",
    "..OBBBBBCCCRRCCCBBBBBO..",
    "..OBBBBBCCCCCCCCBBBBBO..",
    "..OBBBBBCCCCCCCCBBBBBO..",
  ],

  // A little pup in a blue scarf
  pup: [
    "...OO......OO...",
    "..ODBOOOOOOBDO..",
    "..OBBBBBBBBBBO..",
    ".OBBBBBBBBBBBBO.",
    ".OBWEBBBBBBWEBO.",
    ".OBEEBCCCCBEEBO.",
    "KOPPCCCNNCCCPPOK",
    ".OBCCCCMMCCCCBO.",
    "..OBCCCCCCCCBO..",
    ".OObbbbbbbbbbOO.",
    ".ObbbbbbbbbbbbO.",
    ".OBBBbbCCCCBBBO.",
    ".OBBDbbCCCCDBBO.",
    ".OBBBCCCCCCBBBO.",
    ".OBBBCCCCCCBBBO.",
  ],

  gull: [
    "OO...........OO",
    ".OWO.......OWO.",
    "..OWO.OOO.OWO..",
    "...OWOWWWOWO...",
    "....OGWWWWEYO..",
    ".....OWWWWO....",
    "......OOOO.....",
  ],

  cloud: [
    "....LLLL........",
    "..LLLLLLLL.LLL..",
    ".LLLLLLLLLLLLLL.",
    "LLLLLLLLLLLLLLLL",
    "llllllllllllllll",
  ],

  sparkle: [
    "...Y...",
    "...Y...",
    "..YWY..",
    "YYWWWYY",
    "..YWY..",
    "...Y...",
    "...Y...",
  ],

  heart: [
    ".RR.RR.",
    "RrRRRRR",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
  ],

  sun: [
    "....Y....",
    ".Y.YYY.Y.",
    "..YYYYY..",
    ".YYYYYYY.",
    "YYYYYYYYY",
    ".YYYYYYY.",
    "..YYYYY..",
    ".Y.YYY.Y.",
    "....Y....",
  ],

  moon: [
    "..mmmm...",
    ".mmm.....",
    "mmm......",
    "mmm......",
    "mmm......",
    "mmmm....m",
    ".mmmmmmm.",
    "..mmmmm..",
  ],

  shell: [
    "....OOOO....",
    "..OOSsSsOO..",
    ".OSsSsSsSsO.",
    "OSsSsSsSsSsO",
    "OSsSsSsSsSsO",
    ".OSsSsSsSsO.",
    "..OSsSsSsO..",
    "...OOSSOO...",
    "....OSSO....",
    "....OOOO....",
  ],

  palette: [
    "..OOOOOOOO..",
    ".OTTTTTTTTO.",
    "OTRRTYYTTTTO",
    "OTRRTYYTbbTO",
    "OTTTTTTTbbTO",
    "OTggTTOOTTTO",
    "OTggTTTTTTTO",
    ".OTTTTTTTTO.",
    "..OOOOOOOO..",
  ],
};
// Just the otter's head, for the project card
SPRITES.otterFace = SPRITES.otter.slice(0, 11);

// Turn a sprite into little SVG squares
function drawPixels(svg, rows) {
  svg.setAttribute("viewBox", `0 0 ${rows[0].length} ${rows.length}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (!PALETTE[ch]) return;
      const px = document.createElementNS(SVG_NS, "rect");
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

function pixelSprite(name, className) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  return drawPixels(svg, SPRITES[name]);
}

// Fill every <svg data-sprite="..."> on the page
document.querySelectorAll("svg[data-sprite]").forEach((svg) => {
  drawPixels(svg, SPRITES[svg.dataset.sprite]);
});

// =====================================================================
// Stair-stepped pixel waves
// =====================================================================
function steppedWave(base, amp, phase) {
  const STEP_X = 24, STEP_Y = 8;
  let d = "M0 120";
  for (let x = 0; x < 1440; x += STEP_X) {
    const raw = base + amp * Math.sin((x / 720) * Math.PI * 2 + phase);
    const y = Math.round(raw / STEP_Y) * STEP_Y;
    d += ` V${y} H${x + STEP_X}`;
  }
  return d + " V120 Z";
}
document.querySelector(".wave-back").setAttribute("d", steppedWave(48, 20, 0));
document.querySelector(".wave-mid").setAttribute("d", steppedWave(68, 16, 2));
document.querySelector(".wave-front").setAttribute("d", steppedWave(88, 12, 4));

// =====================================================================
// The sky: clouds, sparkles and a seagull
// =====================================================================
const sky = document.querySelector(".sky");

[
  { top: 14, width: 120, dur: 70, delay: -10 },
  { top: 26, width: 80,  dur: 95, delay: -60 },
  { top: 8,  width: 64,  dur: 120, delay: -30 },
].forEach(({ top, width, dur, delay }) => {
  const c = pixelSprite("cloud", "cloud");
  c.style.top = top + "%";
  c.style.width = width + "px";
  c.style.animationDuration = dur + "s";
  c.style.animationDelay = delay + "s";
  sky.appendChild(c);
});

[
  [8, 30], [18, 62], [30, 20], [72, 18], [84, 40], [92, 14], [60, 70], [12, 75],
].forEach(([left, top], i) => {
  const s = pixelSprite("sparkle", "sparkle");
  s.style.left = left + "%";
  s.style.top = top + "%";
  s.style.animationDelay = i * -0.37 + "s";
  sky.appendChild(s);
});

sky.appendChild(pixelSprite("gull", "gull"));

// =====================================================================
// Typewriter tagline
// =====================================================================
const phrases = [
  "UX designer.",
  "Illustrator.",
  "Watercolor painter.",
  "Professional otter counter.",
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

// =====================================================================
// Square pixel bubbles
// =====================================================================
const bubbles = document.querySelector(".bubbles");

function makeBubble(x) {
  const b = document.createElement("span");
  const size = 4 * (2 + Math.floor(Math.random() * 4)); // 8, 12, 16 or 20px
  b.className = "bubble";
  b.style.width = b.style.height = size + "px";
  b.style.left = (x ?? Math.random() * 100) + "%";
  b.style.animationDuration = 6 + Math.random() * 8 + "s";
  bubbles.appendChild(b);
  b.addEventListener("animationend", () => b.remove());
}
if (!reduceMotion) setInterval(makeBubble, 450);

// =====================================================================
// Click an otter: it hops and things float up
// =====================================================================
function floatUp(spriteName, rect, count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = pixelSprite(spriteName, "float-up");
      h.style.left = rect.left + rect.width * (0.1 + Math.random() * 0.8) + "px";
      h.style.top = rect.top + window.scrollY + "px";
      document.body.appendChild(h);
      h.addEventListener("animationend", () => h.remove());
    }, i * 140);
  }
}

const reactions = {
  otter:      (rect) => floatUp("heart", rect, 4),
  heartOtter: (rect) => floatUp("heart", rect, 8),
  pup:        (rect) => floatUp("sparkle", rect, 5),
};

document.querySelectorAll(".critter").forEach((critter) => {
  critter.addEventListener("click", () => {
    critter.classList.remove("hop");
    void critter.getBoundingClientRect(); // restart the animation
    critter.classList.add("hop");
    const rect = critter.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    for (let i = 0; i < 6; i++) setTimeout(() => makeBubble(x + (Math.random() * 8 - 4)), i * 60);
    reactions[critter.dataset.sprite](rect);
  });
});

// =====================================================================
// Day / night toggle
// =====================================================================
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

// =====================================================================
// Reveal sections on scroll
// =====================================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// =====================================================================
// Easter egg: type "otter" for an otter parade
// =====================================================================
let buffer = "";
window.addEventListener("keydown", (e) => {
  buffer = (buffer + e.key.toLowerCase()).slice(-5);
  if (buffer === "otter") {
    buffer = "";
    const crew = ["otter", "heartOtter", "pup"];
    for (let i = 0; i < 9; i++) {
      setTimeout(() => {
        const s = pixelSprite(crew[i % crew.length], "swimmer");
        s.style.top = 10 + Math.random() * 75 + "vh";
        s.style.animationDuration = 4 + Math.random() * 3 + "s";
        document.body.appendChild(s);
        s.addEventListener("animationend", () => s.remove());
      }, i * 300);
    }
  }
});

// =====================================================================
// Darken the header once we're past the hero
// =====================================================================
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.7);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
