const photos = [
    "20683af4-4dfe-4b9b-8230-156e4fbfc1f9.JPG",
    "2959e7f0-5c34-4421-ba74-cb3e43f72c39.JPG",
    "308be9ad-de7f-4f13-9c04-84cc8ea739fb.JPG",
    "30e22698-0f25-44ce-904f-8462d49d00df.JPG",
    "6ad30828-ba70-4ce0-874b-ef7d0090c91d.JPG",
    "7c55336a-bb46-486f-af48-1be90d536694.JPG",
    "95529746-7fd2-4d74-a830-a2fee849c501.JPG",
    "IMG_2785.PNG",
    "IMG_3589.jpg",
    "IMG_4471.jpg",
    "IMG_4480.jpg",
    "IMG_4980.jpg",
    "IMG_4996.jpg",
    "IMG_5321.JPG",
    "IMG_5369.jpg",
    "IMG_5774.PNG",
    "IMG_5813.JPG",
    "IMG_6180.PNG",
    "IMG_6330.JPG",
    "IMG_6503.JPG",
    "IMG_6553.JPG",
    "IMG_6566.JPG",
    "IMG_6644.JPG",
    "IMG_7090.PNG",
    "IMG_7390.JPG",
    "IMG_7999.JPG",
    "IMG_8856.JPG",
    "IMG_8858.JPG",
    "IMG_9116.JPG",
    "IMG_9394.JPG",
    "IMG_9396.JPG",
    "IMG_9697.JPG",
    "IMG_9704.JPG",
    "ab9efe9c-61c0-468c-b471-5fe2316adf9b.JPG",
    "b1bca385-cfeb-438e-8796-6eedd53f09e2.JPG",
    "c8efffb5-dc1c-44cc-b269-d6ec395ca39f.JPG",
    "cdfea829-0b65-4401-8bd9-d956a1898cdf.JPG",
    "d7f53ffc-f977-430c-9909-3803631d72c4.JPG",
    "dbdc7e0e-8676-4ffc-9408-509b8d1207ad.JPG",
    "e40774f4-a06c-4e57-9ace-a1b3710b4f41.JPG",
    "ffadd9dd-445a-453e-bfc0-64829eb9655a.JPG"
];

// Shuffle photos to distribute them randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffleArray(photos);

// Distribute photos into three groups
const carouselPhotos = photos.slice(0, 10);
const gridPhotos = photos.slice(10, 25);
const scatteredPhotos = photos.slice(25, 40);

// Populate Carousel
const carouselEl = document.getElementById('photo-carousel');
carouselPhotos.forEach(photo => {
    const li = document.createElement('li');
    li.className = 'entry';
    li.innerHTML = `<img src="assets/images/${photo}" loading="lazy" alt="Memory">`;
    carouselEl.appendChild(li);
});

// Populate Grid
const gridEl = document.getElementById('photo-grid');
gridPhotos.forEach((photo, idx) => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    // Stagger fallback delay if needed
    div.style.transitionDelay = `${(idx % 4) * 0.1}s`;
    div.innerHTML = `<img src="assets/images/${photo}" loading="lazy" alt="Memory">`;
    gridEl.appendChild(div);
});

// Populate Scattered Polaroids
const scatteredEl = document.getElementById('scattered-container');
scatteredPhotos.forEach((photo, index) => {
    const div = document.createElement('div');
    div.className = 'polaroid';
    
    // Random position and rotation
    const top = Math.random() * 60 + 10; // 10% to 70%
    const left = Math.random() * 80 + 5; // 5% to 85%
    const rot = Math.random() * 40 - 20; // -20deg to +20deg
    
    div.style.top = `${top}%`;
    div.style.left = `${left}%`;
    div.style.transform = `rotate(${rot}deg)`;
    div.style.zIndex = Math.floor(Math.random() * 10);
    
    div.innerHTML = `<img src="assets/images/${photo}" loading="lazy" alt="Memory">`;
    scatteredEl.appendChild(div);
});

// --- Fallback for Scroll-driven animations ---
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal-card, .reveal-text, .grid-item').forEach((el) => {
        observer.observe(el);
    });

    // Carousel fallback
    const entries = document.querySelectorAll('.entry');
    const animations = new Map();
    entries.forEach(entry => {
        const animation = entry.animate(
            { scale: ['0.8', '1', '0.8'], opacity: ['0.5', '1', '0.5'] },
            { duration: 1, fill: 'both' }
        );
        animation.pause();
        animations.set(entry, animation);
    });

    const tick = () => {
        const scrollerRect = carouselEl.getBoundingClientRect();
        entries.forEach(entry => {
            const animation = animations.get(entry);
            if (!animation) return;
            const entryRect = entry.getBoundingClientRect();
            const progress = (entryRect.left + entryRect.width / 2 - scrollerRect.left) / scrollerRect.width;
            animation.currentTime = progress;
        });
    };
    carouselEl.addEventListener('scroll', tick);
    tick();
}

// --- Confetti Logic ---
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const colors = ['#FFB6C1', '#FF69B4', '#FF1493', '#FFE4E1', '#FFFFFF', '#FFD700', '#87CEEB'];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.w = Math.random() * 12 + 5;
        this.h = Math.random() * 12 + 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 3 + 3;
        this.rot = Math.random() * 360;
        this.rotSpeed = Math.random() * 5 - 2.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rot += this.rotSpeed;
        if (this.y > canvas.height) {
            this.y = -this.h;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    }
}

let confettiActive = false;
let animationId;

function spawnConfetti() {
    for (let i = 0; i < 200; i++) {
        particles.push(new Particle());
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    if (confettiActive || particles.length > 0) {
        animationId = requestAnimationFrame(animateConfetti);
    }
    if (!confettiActive) {
        particles = particles.filter(p => p.y < canvas.height + 100);
    }
}

// Confetti celebration on page load
confettiActive = true;
spawnConfetti();
animateConfetti();
setTimeout(() => { confettiActive = false; }, 2500);

// Scroll progress bar
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progressBar.style.width = `${(doc.scrollTop / max) * 100}%`;
}, { passive: true });

document.getElementById('celebrateBtn').addEventListener('click', () => {
    // Open Modal
    document.getElementById('letter-modal').classList.add('active');

    if (!confettiActive) {
        confettiActive = true;
        spawnConfetti();
        animateConfetti();
        setTimeout(() => { confettiActive = false; }, 4000); // 4 seconds of confetti
    }
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('letter-modal').classList.remove('active');
});

// Close modal when clicking outside of the letter
document.getElementById('letter-modal').addEventListener('click', (e) => {
    if (e.target.id === 'letter-modal') {
        e.target.classList.remove('active');
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- Music ---
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
let musicStarted = false;

function startMusic() {
    bgm.muted = false;
    bgm.play().then(() => {
        musicStarted = true;
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('muted');
        musicBtn.textContent = '🎵';
        musicBtn.title = 'Jeda musik';
    }).catch(() => {
        musicBtn.classList.add('muted');
    });
}

function tryMutedAutoplay() {
    bgm.muted = true;
    bgm.play().then(() => {
        musicStarted = true;
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('muted');
        musicBtn.textContent = '🎵';
        musicBtn.title = 'Jeda musik';
    }).catch(() => {
        musicBtn.classList.add('muted');
    });
}

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (musicStarted && !bgm.paused) {
        bgm.pause();
        musicStarted = false;
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
        musicBtn.title = 'Putar musik';
    } else {
        startMusic();
    }
});

// Autoplay on load: try muted first (allowed by most policies),
// then unmute + resume on the first real user gesture.
tryMutedAutoplay();

const startOnScroll = () => {
    if (musicStarted && !bgm.paused && !bgm.muted) return;
    startMusic();
    window.removeEventListener('scroll', startOnScroll);
};
window.addEventListener('scroll', startOnScroll);
