/* === CONFIGURATION === */
const photos = [
  "images/foto1.jpg",
  "images/foto2.jpg",
  "images/foto3.jpg",
  "images/foto4.jpg",
  "images/foto5.jpg", // Pastikan ada 7 foto atau lebih
  "images/foto6.jpg",
  "images/foto7.jpg",
];

const letterText = `Hai Ayu, selamat ulang tahun! ❤️<br><br>
Mungkin ini terlihat sederhana, tapi percayalah, cintaku padamu jauh lebih rumit dan indah dari kode-kode yang membuat website ini.<br><br>
Terima kasih sudah bertahan, terima kasih sudah menjadi rumah.<br><br>
Semoga di usiamu yang baru ini, kebahagiaan selalu menemukan jalan menuju hatimu.<br><br>
Aku mencintaimu, hari ini dan selamanya.`;

/* === INITIALIZATION === */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ once: true });

  // Hide Loading
  setTimeout(() => {
    document.getElementById("loading").style.opacity = "0";
    setTimeout(() => document.getElementById("loading").remove(), 500);
  }, 2000);

  createFloatingHearts();
  initStackGallery();
  initLetter();
  initWishes();
});

/* === 1. FLYING HEARTS ANIMATION === */
function createFloatingHearts() {
  const container = document.getElementById("hearts-container");
  const heartCount = 20; // Jumlah hati

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = '<i class="fas fa-heart"></i>';

    // Random posisi
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 10 + 5 + "s";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.style.animationDelay = Math.random() * 5 + "s";

    container.appendChild(heart);
  }
}

/* === 2. STACKED GALLERY (9:16) === */
function initStackGallery() {
  const stackArea = document.getElementById("stack-area");

  // Reverse agar foto pertama ada di paling atas tumpukan (DOM order)
  [...photos].reverse().forEach((src, index) => {
    const card = document.createElement("div");
    card.classList.add("card-photo");

    // Random sedikit rotasi agar terlihat natural bertumpuk
    const randomRotate = Math.random() * 10 - 5; // -5 deg to 5 deg
    card.style.transform = `rotate(${randomRotate}deg)`;
    card.style.zIndex = index;

    card.innerHTML = `<img src="${src}" alt="Kenangan">`;

    // Event Click
    card.addEventListener("click", function () {
      // Animasi buang kartu
      this.classList.add("fly-out");

      // Setelah animasi selesai, pindahkan ke paling bawah (z-index)
      setTimeout(() => {
        this.classList.remove("fly-out");
        this.style.zIndex = -100; // Pindah ke belakang sementara

        // Re-sort z-index logic (optional for simple loop)
        stackArea.prepend(this); // Pindahkan DOM element ke awal (paling bawah)

        // Reset style
        setTimeout(() => {
          const newRotate = Math.random() * 10 - 5;
          this.style.transform = `rotate(${newRotate}deg)`;
          this.style.zIndex = 0; // Kembalikan ke stack bawah
        }, 50);
      }, 500);
    });

    stackArea.appendChild(card);
  });
}

/* === 3. LETTER INTERACTION & CONFETTI === */
function initLetter() {
  const envelope = document.querySelector(".envelope");
  const trigger = document.getElementById("envelope-trigger");
  const paper = document.getElementById("full-letter");
  const typeArea = document.getElementById("typewriter");

  document.querySelector(".open-btn").addEventListener("click", () => {
    envelope.style.transform = "scale(0)"; // Efek amplop hilang
    trigger.style.opacity = "0";

    triggerConfetti(); // Semburan Kertas

    setTimeout(() => {
      trigger.style.display = "none";
      paper.style.display = "block";
      startTypewriter(typeArea, letterText);
    }, 500);
  });
}

function startTypewriter(element, text) {
  let i = 0;
  // Kita manipulasi HTML tag agar tidak diketik char by char
  element.innerHTML = text; // Untuk demo cepat (bisa diganti logic char by char jika mau)

  // Animasi fade in text
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
      y: canvas.height / 2, // Mulai dari tengah
      w: Math.random() * 10 + 5,
      h: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 20, // Explode X
      vy: (Math.random() - 0.5) * 20, // Explode Y
      gravity: 0.5,
      rotation: Math.random() * 360,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity; // Gravity effect
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

/* === 4. WISHES SLIDER & FIREWORKS === */
function initWishes() {
  const items = document.querySelectorAll(".wish-item");
  let current = 0;

  // Auto slide wishes
  setInterval(() => {
    items[current].classList.remove("active");
    current = (current + 1) % items.length;
    items[current].classList.add("active");
  }, 4000); // Ganti tiap 4 detik

  document
    .getElementById("firework-btn")
    .addEventListener("click", launchFireworks);
}

// Simple Fireworks Logic
function launchFireworks() {
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

  // Create random explosions
  let count = 0;
  const timer = setInterval(() => {
    createExplosion(
      Math.random() * canvas.width,
      (Math.random() * canvas.height) / 2
    );
    count++;
    if (count > 10) clearInterval(timer);
  }, 500);

  function animate() {
    ctx.fillStyle = "rgba(15, 23, 42, 0.2)"; // Trail effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.vy += 0.05; // Gravity

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    });

    if (particles.length > 0 || count <= 10) requestAnimationFrame(animate);
  }
  animate();
}

/* === AUDIO CONTROL === */
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
