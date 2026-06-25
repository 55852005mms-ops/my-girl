/* ============================================================
   MY BESTIE'S WORLD — script.js
   All interactivity: uploads, animations, carousel, game
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===================== PHOTO UPLOAD HANDLER =====================
  document.querySelectorAll('.photo-upload-input').forEach(input => {
    input.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const label = this.nextElementSibling;
        const img = label.querySelector('.uploaded-photo');
        const placeholder = label.querySelector('.photo-placeholder-inner');

        img.src = e.target.result;
        img.style.display = 'block';
        img.style.opacity = '0';
        if (placeholder) placeholder.style.display = 'none';

        // Animate in
        requestAnimationFrame(() => {
          img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        });

        // Burst hearts on upload
        burstHearts(this.closest('.photo-card') || this.closest('.carousel-slide'));
      };
      reader.readAsDataURL(file);
    });
  });

  // Little heart burst on photo upload
  function burstHearts(container) {
    if (!container) return;
    const hearts = ['💖', '💕', '✨', '🌸', '💗'];
    for (let i = 0; i < 8; i++) {
      const span = document.createElement('span');
      span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      span.style.cssText = `
        position: absolute;
        font-size: ${14 + Math.random() * 16}px;
        pointer-events: none;
        z-index: 50;
        left: ${30 + Math.random() * 40}%;
        top: ${30 + Math.random() * 40}%;
        opacity: 1;
        transition: all ${0.6 + Math.random() * 0.8}s cubic-bezier(0.34, 1.56, 0.64, 1);
      `;
      container.style.position = 'relative';
      container.appendChild(span);
      requestAnimationFrame(() => {
        span.style.opacity = '0';
        span.style.transform = `translate(${-40 + Math.random() * 80}px, ${-60 - Math.random() * 40}px) scale(0.3) rotate(${Math.random() * 60 - 30}deg)`;
      });
      setTimeout(() => span.remove(), 1400);
    }
  }


  // ===================== FLOATING HEARTS BACKGROUND =====================
  const heartsBg = document.getElementById('floatingHeartsBg');
  const heartEmojis = ['💖', '💕', '💗', '🌸', '✨', '💜', '🩷', '🤍', '💫'];

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    heart.style.animationDuration = (8 + Math.random() * 12) + 's';
    heart.style.animationDelay = (Math.random() * 2) + 's';
    heartsBg.appendChild(heart);
    setTimeout(() => heart.remove(), 22000);
  }

  // Spawn initial batch
  for (let i = 0; i < 12; i++) {
    setTimeout(spawnHeart, i * 400);
  }
  // Keep spawning
  setInterval(spawnHeart, 2200);


  // ===================== BOKEH LIGHTS =====================
  const bokehLeft = document.getElementById('bokehLeft');
  const bokehRight = document.getElementById('bokehRight');
  const bokehColors = [
    'rgba(244, 143, 177, 0.5)',
    'rgba(206, 147, 216, 0.4)',
    'rgba(255, 215, 0, 0.35)',
    'rgba(144, 202, 249, 0.4)',
    'rgba(255, 183, 77, 0.35)',
    'rgba(233, 30, 140, 0.3)',
  ];

  function createBokeh(container, count) {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      const size = 8 + Math.random() * 20;
      const color = bokehColors[Math.floor(Math.random() * bokehColors.length)];
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        animation: bokeh-float ${3 + Math.random() * 4}s ease-in-out infinite alternate;
        animation-delay: ${Math.random() * 3}s;
        flex-shrink: 0;
      `;
      container.appendChild(dot);
    }
  }

  createBokeh(bokehLeft, 18);
  createBokeh(bokehRight, 18);

  // Add bokeh keyframes
  if (!document.querySelector('#bokeh-keyframes')) {
    const style = document.createElement('style');
    style.id = 'bokeh-keyframes';
    style.textContent = `
      @keyframes bokeh-float {
        0% { transform: translateY(0) scale(1); opacity: 0.5; }
        100% { transform: translateY(-12px) scale(1.15); opacity: 0.9; }
      }
    `;
    document.head.appendChild(style);
  }


  // ===================== STRING LIGHTS CANVAS =====================
  const canvas = document.getElementById('stringLightsCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bulbColors = ['#f48fb1', '#ce93d8', '#ffd54f', '#90caf9', '#ffab91', '#e91e8c'];
    const bulbCount = Math.min(Math.floor(window.innerWidth / 80), 18);
    const bulbs = [];

    for (let i = 0; i < bulbCount; i++) {
      bulbs.push({
        x: (i + 0.5) * (W / bulbCount),
        baseY: 28 + Math.sin(i * 0.7) * 12,
        color: bulbColors[i % bulbColors.length],
        radius: 4 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function drawStringLights(t) {
      ctx.clearRect(0, 0, W, H);

      // Draw wire
      ctx.beginPath();
      ctx.moveTo(0, 30);
      for (let i = 0; i < bulbs.length; i++) {
        const b = bulbs[i];
        const sway = Math.sin(t * 0.001 + b.phase) * 3;
        b.y = b.baseY + sway;
        if (i === 0) {
          ctx.lineTo(b.x, b.y);
        } else {
          const prev = bulbs[i - 1];
          const cpx = (prev.x + b.x) / 2;
          const cpy = Math.max(prev.y, b.y) + 10;
          ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
        }
      }
      ctx.lineTo(W, 30);
      ctx.strokeStyle = 'rgba(180, 130, 160, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw bulbs
      bulbs.forEach(b => {
        const glow = 0.5 + 0.3 * Math.sin(t * 0.002 + b.phase);

        // Glow
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 6);
        grad.addColorStop(0, b.color + Math.floor(glow * 80).toString(16).padStart(2, '0'));
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bulb
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      requestAnimationFrame(drawStringLights);
    }
    requestAnimationFrame(drawStringLights);
  }


  // ===================== GIFTS CAROUSEL =====================
  const track = document.getElementById('giftsTrack');
  const prevBtn = document.getElementById('giftsPrev');
  const nextBtn = document.getElementById('giftsNext');
  const dotsContainer = document.getElementById('giftsDots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const slides = track.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    const total = slides.length;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to gift ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      currentSlide = ((index % total) + total) % total;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Swipe support for mobile
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        dx > 0 ? goToSlide(currentSlide - 1) : goToSlide(currentSlide + 1);
      }
    }, { passive: true });

    // Auto-advance every 5 seconds
    let autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
    const carouselWrapper = track.closest('.carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
      carouselWrapper.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
      });
    }
  }


  // ===================== BESTIE GAME =====================
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noBtnWrapper = document.getElementById('noBtnWrapper');
  const gameQuestion = document.getElementById('gameQuestion');
  const gameSectionTitle = document.getElementById('gameSectionTitle');
  const celebrateOverlay = document.getElementById('celebrateOverlay');
  const gameCard = document.getElementById('gameCard');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const gameButtonsArea = document.getElementById('gameButtonsArea');

  if (noBtn && noBtnWrapper) {
    // No button runs away on hover/touch
    const escapeMessages = [
      'Not an option! 😤',
      'Try again 😜',
      'Nope! 🙅‍♀️',
      'Can\'t click me! 💨',
      'Too slow! 😂',
      'Never! 🏃‍♀️💨',
      'You wish! 🤭',
    ];
    let escapeIndex = 0;

    let yesScale = 1;

    function evadeButton() {
      // Get the boundary of the game card and the wrapper
      const cardRect = gameCard.getBoundingClientRect();
      const wrapperRect = noBtnWrapper.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();

      // Calculate relative bounds for translation
      // We want to keep the button inside the card.
      // The initial position of noBtnWrapper is wrapperRect.left and wrapperRect.top
      // So relative to its initial position, the allowed bounds are:
      const padding = 20;
      const minX = cardRect.left - wrapperRect.left + padding;
      const maxX = cardRect.right - wrapperRect.left - btnRect.width - padding;
      const minY = cardRect.top - wrapperRect.top + padding;
      const maxY = cardRect.bottom - wrapperRect.top - btnRect.height - padding;

      const randX = minX + Math.random() * (maxX - minX);
      const randY = minY + Math.random() * (maxY - minY);

      noBtn.style.transform = `translate(${randX}px, ${randY}px)`;
      noBtn.textContent = escapeMessages[escapeIndex % escapeMessages.length];
      escapeIndex++;

      // Make Yes button bigger!
      yesScale += 0.2;
      yesBtn.style.transform = `scale(${yesScale})`;
      yesBtn.style.transition = 'transform 0.3s ease, font-size 0.3s ease';

      // Yes button eats the No button after 6 tries!
      if (escapeIndex >= 6) {
        noBtnWrapper.style.display = 'none';
        yesBtn.innerHTML = 'OMNOMNOM 😋<br>I ate the No button!<br>Say YES! ❤️';
        yesBtn.style.fontSize = '1.2rem';
        yesBtn.style.lineHeight = '1.4';
      }
    }

    noBtn.addEventListener('mouseenter', evadeButton);
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      evadeButton();
    }, { passive: false });
  }

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      // Update text
      gameQuestion.textContent = 'YAYY!! 🎉 I knew it!! Besties FOREVER!! 💖💖💖';
      gameQuestion.classList.add('love-mode');

      gameSectionTitle.textContent = '💖 Best Day Ever!! 💖';
      gameSectionTitle.style.webkitTextFillColor = 'transparent';
      gameSectionTitle.style.background = 'linear-gradient(135deg, #e91e8c, #ff6f00, #9c27b0)';
      gameSectionTitle.style.webkitBackgroundClip = 'text';
      gameSectionTitle.style.backgroundClip = 'text';

      // Hide buttons
      yesBtn.style.display = 'none';
      if (noBtnWrapper) noBtnWrapper.style.display = 'none';

      // Show celebration overlay
      if (celebrateOverlay) {
        celebrateOverlay.classList.add('active');
        celebrateOverlay.setAttribute('aria-hidden', 'false');
      }

      // Launch confetti
      if (confettiCanvas) launchConfetti(confettiCanvas);

      // Burst hearts from game card
      burstHearts(gameCard);

      // Shake the card joyfully
      gameCard.style.animation = 'love-bounce 0.7s cubic-bezier(0.34,1.56,0.64,1)';
    });
  }


  // ===================== CONFETTI =====================
  function launchConfetti(canvasEl) {
    const ctx = canvasEl.getContext('2d');
    const W = canvasEl.width = canvasEl.offsetWidth;
    const H = canvasEl.height = canvasEl.offsetHeight;
    const pieces = [];
    const colors = ['#e91e8c', '#f48fb1', '#ce93d8', '#ffd700', '#90caf9', '#ff6f00', '#43e97b', '#ff4081', '#7c4dff'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: W / 2 + (Math.random() - 0.5) * 60,
        y: H / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: -4 - Math.random() * 10,
        w: 5 + Math.random() * 8,
        h: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.15 + Math.random() * 0.1,
        opacity: 1,
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;

      pieces.forEach(p => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.vx *= 0.99;

        if (frame > 60) p.opacity -= 0.015;
        if (p.opacity <= 0) return;
        alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (alive && frame < 200) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    }
    requestAnimationFrame(animate);
  }


  // ===================== SCROLL REVEAL =====================
  const revealElements = document.querySelectorAll('.section, .photo-card, .carousel-wrapper, .envelope-wrapper, .game-card');
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach(el => observer.observe(el));


  // ===================== SMOOTH NAV SCROLL =====================
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ===================== PARALLAX HEADER =====================
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 600) {
        header.style.transform = `translateY(${scrollY * 0.15}px)`;
        header.style.opacity = Math.max(0.3, 1 - scrollY / 500);
      }
    }, { passive: true });
  }

});
