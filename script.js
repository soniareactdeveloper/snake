const container = document.getElementById("snake-container");
const particlesContainer = document.getElementById("particles");
const colorBtn = document.getElementById("color-btn");
const speedBtn = document.getElementById("speed-btn");
const resetBtn = document.getElementById("reset-btn");

const numSegments = 30;
const segments = [];

// Snake configuration
let config = {
  color: "limegreen",
  speed: 0.2,
  segmentLength: 15
};

// Create snake segments
for (let i = 0; i < numSegments; i++) {
  const seg = document.createElement("div");
  seg.classList.add("segment");
  if (i === 0) seg.classList.add("head");
  container.appendChild(seg);
  segments.push({ x: 0, y: 0, el: seg });
}

let mouse = { x: 0, y: 0 };
let isMouseInContainer = false;
let isDragging = false;

// Update mouse position
container.addEventListener("mousemove", (e) => {
  const rect = container.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  isMouseInContainer = true;
});

container.addEventListener("mouseleave", () => {
  isMouseInContainer = false;
});

// Touch support for mobile devices
container.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDragging = true;
  updateTouchPosition(e);
});

container.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (isDragging) {
    updateTouchPosition(e);
  }
});

container.addEventListener("touchend", () => {
  isDragging = false;
});

function updateTouchPosition(e) {
  const rect = container.getBoundingClientRect();
  const touch = e.touches[0];
  mouse.x = touch.clientX - rect.left;
  mouse.y = touch.clientY - rect.top;
  isMouseInContainer = true;
}

// Color options
const colors = [
  { name: "Green", value: "limegreen" },
  { name: "Blue", value: "#64ffda" },
  { name: "Pink", value: "#ff6b6b" },
  { name: "Purple", value: "#9d4edd" },
  { name: "Orange", value: "#ff9e00" }
];

let colorIndex = 0;

// Speed options
const speeds = [
  { name: "Slow", value: 0.1 },
  { name: "Medium", value: 0.2 },
  { name: "Fast", value: 0.3 },
  { name: "Very Fast", value: 0.4 }
];

let speedIndex = 1;

// Button event listeners
colorBtn.addEventListener("click", () => {
  colorIndex = (colorIndex + 1) % colors.length;
  config.color = colors[colorIndex].value;
  colorBtn.innerHTML = `<i class="fas fa-palette"></i> <span class="btn-text">${colors[colorIndex].name}</span>`;
});

speedBtn.addEventListener("click", () => {
  speedIndex = (speedIndex + 1) % speeds.length;
  config.speed = speeds[speedIndex].value;
  speedBtn.innerHTML = `<i class="fas fa-tachometer-alt"></i> <span class="btn-text">${speeds[speedIndex].name}</span>`;
});

resetBtn.addEventListener("click", () => {
  // Reset snake position to center
  const rect = container.getBoundingClientRect();
  for (let i = 0; i < segments.length; i++) {
    segments[i].x = rect.width / 2;
    segments[i].y = rect.height / 2;
  }
});

// Create background particles
function createParticles() {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particlesContainer.appendChild(particle);
  }
}

createParticles();

function animate() {
  // Head follows mouse only if mouse is in container or dragging on mobile
  if (isMouseInContainer || isDragging) {
    segments[0].x += (mouse.x - segments[0].x) * config.speed;
    segments[0].y += (mouse.y - segments[0].y) * config.speed;
  }

  // Body follows head
  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];

    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    curr.x = prev.x - Math.cos(angle) * config.segmentLength;
    curr.y = prev.y - Math.sin(angle) * config.segmentLength;

    const size = Math.max(40 - i * 1.2, 10);
    curr.el.style.width = `${size}px`;
    curr.el.style.height = `${size}px`;
    curr.el.style.left = `${curr.x - size / 2}px`;
    curr.el.style.top = `${curr.y - size / 2}px`;
    curr.el.style.backgroundColor = config.color;
    curr.el.style.color = config.color;
    
    // Add opacity gradient to tail
    const opacity = Math.max(0.3, 1 - i * 0.03);
    curr.el.style.opacity = opacity;
  }

  requestAnimationFrame(animate);
}

// Initialize snake position to center
function initializeSnakePosition() {
  const rect = container.getBoundingClientRect();
  for (let i = 0; i < segments.length; i++) {
    segments[i].x = rect.width / 2;
    segments[i].y = rect.height / 2;
  }
}

// Handle window resize
window.addEventListener('resize', initializeSnakePosition);

// Initialize the snake position when the page loads
window.addEventListener('load', initializeSnakePosition);

animate();