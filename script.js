// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Current date in apology card
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Initialize systems
    initBackgroundCanvas();
    initSlideTransitions();
    initLoveMeter();
    initRunawayButton();
    initCelebration();
});

/* ==========================================================================
   1. Dynamic Background: Twinkling Stars & Rising Hearts
   ========================================================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let hearts = [];
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star Class
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5;
            this.alpha = Math.random();
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        }

        update() {
            this.alpha += this.twinkleSpeed * this.twinkleDir;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.twinkleDir = -1;
            } else if (this.alpha <= 0.1) {
                this.alpha = 0.1;
                this.twinkleDir = 1;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Floating Heart Class
    class BackgroundHeart {
        constructor(stagger = false) {
            this.reset(stagger);
        }

        reset(stagger = false) {
            this.x = Math.random() * canvas.width;
            this.y = stagger ? Math.random() * canvas.height : canvas.height + 20;
            this.size = Math.random() * 12 + 6;
            this.speedY = -(Math.random() * 0.8 + 0.4);
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.25 + 0.05;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            // Wobble
            this.speedX += Math.sin(this.y / 40) * 0.02;

            if (this.y < -this.size) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.fillStyle = `rgba(255, 77, 121, ${this.opacity})`;
            drawHeartShape(ctx, this.x, this.y, this.size);
            ctx.restore();
        }
    }

    // Populate
    const starCount = Math.min(Math.floor(window.innerWidth / 8), 120);
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    const heartCount = Math.min(Math.floor(window.innerWidth / 35), 30);
    for (let i = 0; i < heartCount; i++) {
        hearts.push(new BackgroundHeart(true)); // stagger heights initially
    }

    // Canvas Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Render Stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Render Hearts
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Global heart drawing helper
function drawHeartShape(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x + size / 2, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
    ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
    ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
    ctx.quadraticCurveTo(x, y, x + size / 2, y);
    ctx.closePath();
    ctx.fill();
}


/* ==========================================================================
   2. Slide Navigation transitions
   ========================================================================== */
function initSlideTransitions() {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const nextBtns = document.querySelectorAll('.next-slide-btn');
    const prevBtns = document.querySelectorAll('.prev-slide-btn');
    const envelopeBtn = document.getElementById('envelope-click');

    // Envelope opening transitions from Slide 1 -> Slide 2
    envelopeBtn.addEventListener('click', () => {
        const envelope = document.getElementById('envelope');
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            
            // Wait for flap/card lift animation to play, then transition slide
            setTimeout(() => {
                transitionSlide('slide-1', 'slide-2', 'forward');
            }, 1200);
        }
    });

    // Handle generic next slide triggers
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextSlideId = btn.getAttribute('data-next');
            const currentSlideId = btn.closest('.slide').id;
            transitionSlide(currentSlideId, nextSlideId, 'forward');
        });
    });

    // Handle generic previous slide triggers
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevSlideId = btn.getAttribute('data-prev');
            const currentSlideId = btn.closest('.slide').id;
            transitionSlide(currentSlideId, prevSlideId, 'backward');
        });
    });

    function transitionSlide(currentId, targetId, direction) {
        const currentSlide = document.getElementById(currentId);
        const targetSlide = document.getElementById(targetId);

        if (!currentSlide || !targetSlide) return;

        // Reset directions
        currentSlide.className = 'slide';
        targetSlide.className = 'slide';

        if (direction === 'forward') {
            currentSlide.classList.add('to-left');
            targetSlide.classList.add('to-right');
            
            // Force redraw
            targetSlide.offsetHeight;
            
            targetSlide.classList.remove('to-right');
            targetSlide.classList.add('active');
        } else {
            currentSlide.classList.add('to-right');
            targetSlide.classList.add('to-left');
            
            // Force redraw
            targetSlide.offsetHeight;
            
            targetSlide.classList.remove('to-left');
            targetSlide.classList.add('active');
        }
    }
}





/* ==========================================================================
   4. Missing-You Range Slider & Interactive Heart
   ========================================================================== */
function initLoveMeter() {
    const slider = document.getElementById('love-slider');
    const scaleHeart = document.getElementById('scale-heart');
    const percentLabel = document.getElementById('meter-percent');
    const statusMsg = document.getElementById('meter-status');
    const nextBtn = document.getElementById('meter-next-btn');
    const lockIcon = document.getElementById('meter-lock-icon');

    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        
        // Scale and glow heart based on value
        const scaleVal = 1 + (val / 100) * 0.9; // Scale from 1x to 1.9x
        scaleHeart.style.transform = `scale(${scaleVal})`;
        
        const glowVal = (val / 100) * 25; // Glow shadow up to 25px
        scaleHeart.style.filter = `drop-shadow(0 0 ${glowVal}px rgba(255, 77, 121, 0.7))`;
        
        // Update label
        percentLabel.textContent = `${val}%`;

        // Update cute descriptive text based on score
        if (val === 0) {
            statusMsg.textContent = 'Slide to measure...';
            statusMsg.style.color = 'var(--text-muted)';
        } else if (val < 20) {
            statusMsg.textContent = 'Still ignoring me? 😢';
            statusMsg.style.color = '#c3b9d0';
        } else if (val < 50) {
            statusMsg.textContent = 'Maybe a little bit... 🤏';
            statusMsg.style.color = '#f0a6ca';
        } else if (val < 80) {
            statusMsg.textContent = "A lot, but I'm still pouting! 😤";
            statusMsg.style.color = '#ff85a2';
        } else if (val < 100) {
            statusMsg.textContent = 'To the moon and back! 🚀❤️';
            statusMsg.style.color = 'var(--primary)';
        } else {
            statusMsg.textContent = 'I miss you like crazy! ❤️ (Unlocked!)';
            statusMsg.style.color = 'var(--accent)';
            
            // Unlock next stage!
            nextBtn.classList.remove('locked');
            nextBtn.removeAttribute('disabled');
            lockIcon.className = 'fas fa-chevron-right';
        }
    });
}


/* ==========================================================================
   5. Runaway "No" Button (teleports away from cursor/touch)
   ========================================================================== */
function initRunawayButton() {
    const noBtn = document.getElementById('btn-no');

    function teleportButton(e) {
        noBtn.classList.add('moving');
        
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
        // Keep a 30px safe border from edges
        const padding = 30;
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;
        
        let randomX = Math.random() * (maxX - padding) + padding;
        let randomY = Math.random() * (maxY - padding) + padding;
        
        // Grab current cursor/pointer coordinates to stay away from it
        const pointerX = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
        const pointerY = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
        
        const safetyRadius = 160;
        
        // Check if random coordinate is too close to cursor, recalculate or shift if needed
        const dist = Math.hypot(randomX - pointerX, randomY - pointerY);
        if (dist < safetyRadius) {
            // Push it away diagonally
            const angle = Math.atan2(randomY - pointerY, randomX - pointerX);
            randomX = pointerX + Math.cos(angle) * safetyRadius;
            randomY = pointerY + Math.sin(angle) * safetyRadius;
            
            // Boundary constraints check
            if (randomX < padding) randomX = padding + Math.random() * 50;
            if (randomX > maxX) randomX = maxX - Math.random() * 50;
            if (randomY < padding) randomY = padding + Math.random() * 50;
            if (randomY > maxY) randomY = maxY - Math.random() * 50;
        }

        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    }

    noBtn.addEventListener('mouseenter', teleportButton);
    noBtn.addEventListener('mouseover', teleportButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Stop default tap
        teleportButton(e);
    });
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        teleportButton(e);
    });
}


/* ==========================================================================
   6. Grand Celebration & Canvas Confetti Engine
   ========================================================================== */
let confettiParticles = [];
let confettiAnimId = null;

function initCelebration() {
    const yesBtn = document.getElementById('btn-yes');
    const successOverlay = document.getElementById('success-overlay');
    const finishBtn = document.getElementById('finish-btn');
    const noBtn = document.getElementById('btn-no');

    yesBtn.addEventListener('click', () => {
        successOverlay.classList.add('open');
        triggerConfettiCelebration();
    });

    finishBtn.addEventListener('click', () => {
        successOverlay.classList.remove('open');
        
        // Reset No button style positioning
        noBtn.classList.remove('moving');
        noBtn.style.top = '';
        noBtn.style.left = '';
        
        if (confettiAnimId) {
            cancelAnimationFrame(confettiAnimId);
        }
    });
}

class CelebrationConfetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height - 20;
        this.size = Math.random() * 14 + 8;
        this.color = ['#ff4d79', '#ff85a2', '#f0a6ca', '#ffd166', '#a5ffd6', '#ffffff'][Math.floor(Math.random() * 6)];
        this.speedY = Math.random() * 5 + 3;
        this.speedX = Math.random() * 3 - 1.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 6 - 3;
        this.type = Math.random() > 0.4 ? 'heart' : 'rectangle';
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedX += Math.sin(this.y / 25) * 0.05; // Wind sway
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        
        if (this.type === 'heart') {
            drawHeartShape(ctx, -this.size / 2, -this.size / 2, this.size);
        } else {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
        }
        
        ctx.restore();
    }
}

function triggerConfettiCelebration() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    confettiParticles = [];

    // Prepopulate particles
    for (let i = 0; i < 120; i++) {
        confettiParticles.push(new CelebrationConfetti(canvas));
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let hasActiveParticles = false;

        confettiParticles.forEach(p => {
            p.update();
            p.draw(ctx);
            if (p.y < canvas.height + 20) {
                hasActiveParticles = true;
            }
        });

        // Spawn extra particles dynamically as long as coupon is open
        const overlay = document.getElementById('success-overlay');
        if (overlay.classList.contains('open')) {
            hasActiveParticles = true;
            if (confettiParticles.length < 220 && Math.random() < 0.3) {
                confettiParticles.push(new CelebrationConfetti(canvas));
            }
        }

        // Filter out of bounds
        confettiParticles = confettiParticles.filter(p => p.y < canvas.height + 20);

        if (hasActiveParticles) {
            confettiAnimId = requestAnimationFrame(loop);
        }
    }

    if (confettiAnimId) {
        cancelAnimationFrame(confettiAnimId);
    }
    loop();
}
