gsap.registerPlugin(ScrollTrigger);

// ==============================
// HERO ENTRANCE ANIMATION
// ==============================
(function () {
  const heroImg = document.querySelector('.gallery-hero-bg img');
  const heroTitle = document.querySelector('.gallery-hero-content h1');
  const heroDesc = document.querySelector('.gallery-hero-desc');
  const heroSubtitle = document.querySelector('.gallery-hero-content .subtitle');
  const scrollCue = document.querySelector('.scroll-cue');

  // Trigger the slow ken-burns zoom
  window.addEventListener('load', () => {
    if (heroImg) heroImg.classList.add('loaded');
  });

  // Animate hero content in
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to(heroSubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .to(heroTitle, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
    }, '-=0.5')
    .to(heroDesc, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.7')
    .to(scrollCue, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4');

  // Parallax on hero when scrolling down
  gsap.to('.gallery-hero-content', {
    y: -120,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.gallery-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
})();

// ==============================
// HORIZONTAL SCROLL — CINEMATIC
// ==============================
(function () {
  const track = document.getElementById('galleryTrack');
  const panels = gsap.utils.toArray('.gallery-panel');
  const progressEl = document.getElementById('galleryProgress');
  const progressBar = document.getElementById('galleryProgressBar');
  const currentSlideEl = document.getElementById('galleryCurrentSlide');
  const totalSlidesEl = document.getElementById('galleryTotalSlides');

  if (!track || panels.length === 0) return;

  totalSlidesEl.textContent = String(panels.length).padStart(2, '0');

  // Calculate the total horizontal distance
  const getScrollDistance = () => track.scrollWidth - window.innerWidth;

  // Main horizontal scroll tween
  const scrollTween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.gallery-horizontal-wrap',
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Update progress bar
        const progress = self.progress;
        progressBar.style.setProperty('--progress', `${progress * 100}%`);
        progressBar.querySelector(':after') ||
          (progressBar.style.cssText += '');

        // Manually update the ::after pseudo via a CSS variable
        progressBar.style.setProperty('width', '200px'); // keep width
        // We'll use a real child element instead for easier JS control
        updateProgressBarWidth(progress);

        // Update counter
        const currentIdx = Math.min(
          Math.floor(progress * panels.length),
          panels.length - 1
        );
        currentSlideEl.textContent = String(currentIdx + 1).padStart(2, '0');
      },
      onToggle: (self) => {
        if (self.isActive) {
          progressEl.classList.add('visible');
        } else {
          progressEl.classList.remove('visible');
        }
      },
    },
  });

  // Progress bar fill — use a child div approach
  // Add fill element
  const fillBar = document.createElement('div');
  fillBar.style.cssText = `
    position: absolute; left: 0; top: 0; height: 100%;
    background: var(--gold); border-radius: 2px;
    width: 0%; transition: none;
  `;
  progressBar.appendChild(fillBar);
  // Hide the ::after by making it transparent
  progressBar.style.setProperty('overflow', 'hidden');

  function updateProgressBarWidth(progress) {
    fillBar.style.width = `${progress * 100}%`;
  }

  // Animate captions for each panel
  panels.forEach((panel, i) => {
    const caption = panel.querySelector('.panel-caption');
    const img = panel.querySelector('.panel-img-wrap img');

    if (caption) {
      gsap.to(caption, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left 60%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Parallax on images (ken-burns during scroll)
    if (img) {
      gsap.to(img, {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      });
    }
  });

  // Refresh ScrollTrigger after images load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
})();

// ==============================
// LIGHTBOX
// ==============================
(function () {
  // Create lightbox element
  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Fechar">×</button>
    <img src="" alt="Galeria">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Click on panel images to open lightbox
  document.querySelectorAll('.panel-img-wrap img').forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ==============================
// CTA REVEAL
// ==============================
gsap.utils.toArray('.gallery-cta-inner').forEach((el) => {
  gsap.from(el, {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
});

// ==============================
// CUSTOM CURSOR (same as main site)
// ==============================
(function () {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');

  if (!dot || !outline) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    outline.animate(
      { left: `${e.clientX}px`, top: `${e.clientY}px` },
      { duration: 500, fill: 'forwards' }
    );
  });

  document
    .querySelectorAll('a, button, .panel-img-wrap')
    .forEach((el) => {
      el.addEventListener('mouseenter', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        outline.style.backgroundColor = 'rgba(36, 64, 38, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.backgroundColor = 'transparent';
      });
    });
})();
