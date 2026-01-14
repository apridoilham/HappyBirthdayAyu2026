/* === CONFIGURATION === */
const photos = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg",
  "images/4.jpg",
  "images/5.jpg",
  "images/6.jpg",
  "images/7.jpg",
  "images/8.jpg",
  "images/9.jpg",
  "images/10.jpg",
  "images/11.jpg",
  "images/12.jpg",
];

const letterText = `Hi Ayu, Happy Birthday. ❤️<br><br>
If there is one definition of magic I am most grateful for, it is the moment the universe crossed my path with yours.<br><br>
Thank you for not giving up, thank you for being the safest home to return to when the world isn't kind.<br><br>
I may not be able to give you the world just yet, but I promise to always try to make your world enough and happy.<br><br>
May all good prayers embrace you in this new age. Let's grow old together, enjoying second by second, day by day.<br><br>
I love you, more than words can say.`;

/* === INITIALIZATION === */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ once: true });

  // Hide Loading
  setTimeout(() => {
    document.getElementById("loading").style.opacity = "0";
    setTimeout(() => document.getElementById("loading").remove(), 500);
  }, 2000);

  // Panggil Love Animation hanya untuk Hero (#hearts-hero) dan Footer (#hearts-footer)
  createFloatingHearts("hearts-hero");
  createFloatingHearts("hearts-footer");

  initStackGallery();
  initLetter();
  initWishes();
  initMusicAutoPlay();
});

/* === MUSIC AUTO PLAY ON ANY TAP (IMMEDIATE) === */
function initMusicAutoPlay() {
  const audio = document.getElementById("bg-music");
  const iconPlay = document.querySelector(".icon-play");
  const iconPause = document.querySelector(".icon-pause");

  const playAudio = () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          iconPlay.style.display = "none";
          iconPause.style.display = "block";
          document.removeEventListener("click", playAudio);
          document.removeEventListener("touchstart", playAudio);
          document.removeEventListener("scroll", playAudio);
        })
        .catch((err) => {
          console.log("Waiting for user interaction...");
        });
    }
  };

  document.addEventListener("click", playAudio);
  document.addEventListener("touchstart", playAudio);
  document.addEventListener("scroll", playAudio);
}

/* === 1. FLYING HEARTS ANIMATION (Targeted) === */
function createFloatingHearts(containerId) {
  const container = document.getElementById(containerId);
  // Cek jika container ada
  if (!container) return;

  const heartCount = 15; // Jumlah hati per container

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = '<i class="fas fa-heart"></i>';

    // Random posisi dan animasi
    heart.style.left = Math.random() * 100 + "%"; // Menggunakan % agar relatif terhadap container
    heart.style.animationDuration = Math.random() * 10 + 5 + "s";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.style.animationDelay = Math.random() * 5 + "s";

    container.appendChild(heart);
  }
}

/* === 2. STACKED GALLERY === */
function initStackGallery() {
  const stackArea = document.getElementById("stack-area");

  [...photos].reverse().forEach((src, index) => {
    const card = document.createElement("div");
    card.classList.add("card-photo");

    const randomRotate = Math.random() * 10 - 5;
    card.style.transform = `rotate(${randomRotate}deg)`;
    card.style.zIndex = index;

    card.innerHTML = `<img src="${src}" alt="Memories">`;

    card.addEventListener("click", function () {
      this.classList.add("fly-out");
      setTimeout(() => {
        this.classList.remove("fly-out");
        this.style.zIndex = -100;
        stackArea.prepend(this);
        setTimeout(() => {
          const newRotate = Math.random() * 10 - 5;
          this.style.transform = `rotate(${newRotate}deg)`;
          this.style.zIndex = 0;
        }, 50);
      }, 500);
    });

    stackArea.appendChild(card);
  });
}

/* === 3. LETTER INTERACTION === */
function initLetter() {
  const envelope = document.querySelector(".envelope");
  const trigger = document.getElementById("envelope-trigger");
  const paper = document.getElementById("full-letter");
  const typeArea = document.getElementById("typewriter");

  document.querySelector(".open-btn").addEventListener("click", () => {
    envelope.style.transform = "scale(0)";
    trigger.style.opacity = "0";

    triggerConfetti();

    setTimeout(() => {
      trigger.style.display = "none";
      paper.style.display = "block";
      startTypewriter(typeArea, letterText);
    }, 500);
  });
}

function startTypewriter(element, text) {
  let i = 0;
  element.innerHTML = text;
  element.style.opacity = 0;
  let op = 0;
  const timer = setInterval(() => {
    if (op >= 1) clearInterval(timer);
    element.style.opacity = op;
    op += 0.05;
  }, 50);
}

function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#f472b6", "#facc15", "#22d3ee", "#ffffff"];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: Math.random() * 10 + 5,
      h: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      gravity: 0.5,
      rotation: Math.random() * 360,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += 5;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      if (p.y > canvas.height) pieces.splice(i, 1);
    });

    if (pieces.length > 0) requestAnimationFrame(animate);
  }
  animate();
}

/* === 4. WISHES & INFINITE FIREWORKS === */
function initWishes() {
  const items = document.querySelectorAll(".wish-item");
  let current = 0;

  setInterval(() => {
    items[current].classList.remove("active");
    current = (current + 1) % items.length;
    items[current].classList.add("active");
  }, 5000);

  document
    .getElementById("firework-btn")
    .addEventListener("click", launchFireworks);
}

let isFireworksPlaying = false;

function launchFireworks() {
  if (isFireworksPlaying) return;
  isFireworksPlaying = true;

  const btn = document.getElementById("firework-btn");
  btn.innerText = "Celebrating Forever!";
  btn.style.opacity = "0.7";

  const canvas = document.getElementById("fireworks-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  function createExplosion(x, y) {
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 100,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      });
    }
  }

  setInterval(() => {
    createExplosion(
      Math.random() * canvas.width,
      (Math.random() * canvas.height) / 2
    );
  }, 800);

  function animate() {
    ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vy += 0.05;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* === AUDIO CONTROL (Button Manual) === */
const audio = document.getElementById("bg-music");
const btn = document.getElementById("toggle-music");
const iconPlay = document.querySelector(".icon-play");
const iconPause = document.querySelector(".icon-pause");

btn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    iconPlay.style.display = "none";
    iconPause.style.display = "block";
  } else {
    audio.pause();
    iconPlay.style.display = "block";
    iconPause.style.display = "none";
  }
});
