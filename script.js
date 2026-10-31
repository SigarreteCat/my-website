// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  otter.classList.remove("spin");
  void otter.offsetWidth; // restart the animation
  otter.classList.add("spin");
  const rect = otter.getBoundingClientRect();
  const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
  for (let i = 0; i < 12; i++) setTimeout(() => makeBubble(x + (Math.random() * 10 - 5)), i * 60);
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
        const s = document.createElement("div");
        s.className = "swimmer";
        s.textContent = "🦦";
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
