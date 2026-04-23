gsap.registerPlugin(ScrollTrigger);

// ==============================
// VIDEO REFERENCES
// ==============================
const heroVideo = document.getElementById('heroVideo');
const introVideo = document.getElementById('introVideo');

// Preload both videos
heroVideo.preload = 'auto';
introVideo.preload = 'auto';
introVideo.currentTime = 8;
heroVideo.currentTime = 8;

// Start hero video playing silently behind the overlay immediately
// so it's ready and in-sync when we reveal it
function bootHeroVideo() {
    heroVideo.currentTime = 8;
    heroVideo.play().catch(() => {});
}

// Try to start it ASAP
if (heroVideo.readyState >= 3) {
    bootHeroVideo();
} else {
    heroVideo.addEventListener('canplaythrough', bootHeroVideo, { once: true });
}

// Promise: intro video ready
const introVideoReady = new Promise((resolve) => {
    if (introVideo.readyState >= 3) { resolve(); return; }
    introVideo.addEventListener('canplaythrough', () => resolve(), { once: true });
    setTimeout(resolve, 3000);
});

// Sync interval — keeps heroVideo matched to introVideo
let syncInterval = null;
function startSync() {
    syncInterval = setInterval(() => {
        if (Math.abs(heroVideo.currentTime - introVideo.currentTime) > 0.2) {
            heroVideo.currentTime = introVideo.currentTime;
        }
    }, 200);
}
function stopSync() {
    if (syncInterval) clearInterval(syncInterval);
}

// Video loop (after intro completes)
function enableLoop() {
    heroVideo.addEventListener('timeupdate', () => {
        if (heroVideo.currentTime >= 53) {
            heroVideo.currentTime = 8;
        }
    });
}

// ==============================
// ICEBERG-STYLE INTRO ANIMATION (UNTOUCHED)
// ==============================
(function() {
    const overlay = document.getElementById('introOverlay');
    const flashImgs = document.querySelectorAll('.flash-img');
    const flashContainer = document.getElementById('flashPhotos');
    const heroTitle = document.getElementById('heroTitleGiant');
    const heroHandwritten = document.getElementById('heroHandwritten');
    const navbar = document.querySelector('.navbar');

    // Check if intro was already played this session
    const introPlayed = sessionStorage.getItem('introPlayed');

    if (introPlayed) {
        // Skip intro
        overlay.style.display = 'none';
        overlay.classList.add('done');
        document.body.style.overflow = '';
        gsap.set(navbar, { opacity: 1, y: 0 });
        gsap.set(heroTitle, { opacity: 1, y: 0 });
        gsap.set(heroHandwritten, { opacity: 1, y: 0 });
        enableLoop();
        
        // Ensure spans are visible if they were split
        setTimeout(() => {
            gsap.set('.phrase-line span', { opacity: 1, y: 0 });
        }, 100);
        return;
    }

    // Hide navbar during intro
    gsap.set(navbar, { opacity: 0, y: -40 });

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    // Text Splitting for smooth reveal
    const splitText = (el) => {
        if (!el) return;
        const text = el.textContent.trim();
        el.textContent = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)';
            el.appendChild(span);
        });
    };

    const phraseLines = document.querySelectorAll('.phrase-line');
    phraseLines.forEach(line => splitText(line));

    // Wait for intro video to be ready, THEN start
    introVideoReady.then(() => {
        runIntro();
    });

    function runIntro() {
        const introTl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = '';
                overlay.classList.add('done');
                // Stop intro video, enable loop on hero video
                introVideo.pause();
                enableLoop();
                sessionStorage.setItem('introPlayed', 'true');
                setTimeout(() => { overlay.style.display = 'none'; }, 100);
            }
        });

        // Phase 1: Flash photos rapidly
        const flashDuration = 0.15;
        const flashGap = 0.25;

        flashImgs.forEach((img, i) => {
            const startTime = i * flashGap;
            introTl
                .set(img, { scale: 0.8, rotation: 0 }, startTime)
                .to(img, {
                    opacity: 1,
                    scale: 1,
                    duration: flashDuration,
                    ease: 'power2.in'
                }, startTime)
                .to(img, {
                    opacity: 0,
                    duration: flashDuration,
                    ease: 'power2.out'
                }, startTime + flashDuration);
        });

        // Phase 2: After flashing, show the VIDEO inside the small rectangle
        const holdStart = flashImgs.length * flashGap + 0.2;

        // Start playing the intro video and sync hero video behind it
        introTl.call(() => {
            introVideo.currentTime = 8;
            introVideo.play().catch(() => {});
            // Start syncing the hero video to match intro video
            startSync();
        }, null, holdStart);

        introTl.to(introVideo, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, holdStart);

        // Phase 3: THE VIDEO RECTANGLE EXPANDS to fullscreen (like Iceberg!)
        const expandStart = holdStart + 1.0;

        introTl
            .to(flashContainer, {
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                duration: 1.6,
                ease: 'power3.inOut'
            }, expandStart)
            .to(introVideo, {
                borderRadius: 0,
                duration: 1.6,
                ease: 'power3.inOut'
            }, expandStart);

        // Phase 4: Cross-fade overlay away (hero video is already in sync behind it)
        const fadeStart = expandStart + 1.6;

        // Final hard sync right before the overlay fades
        introTl.call(() => {
            heroVideo.currentTime = introVideo.currentTime;
            stopSync();
        }, null, fadeStart - 0.05);

        introTl.to(overlay, {
            opacity: 0,
            duration: 1.0,
            ease: 'power2.inOut'
        }, fadeStart);

        // Phase 5: Reveal hero content
        const revealStart = fadeStart + 0.5;

        introTl
            .to(heroTitle, {
                opacity: 1,
                y: 0,
                duration: 1.4,
                ease: 'power4.out'
            }, revealStart);

        introTl
            .to(heroHandwritten, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out'
            }, revealStart + 0.3);

        // Character reveal animation
        const characters = document.querySelectorAll('.phrase-line span');
        introTl.to(characters, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: 'power2.out'
        }, revealStart + 0.5);


        introTl.to(navbar, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, revealStart + 1.2);
    }
})();

// ==============================
// CUSTOM CURSOR (Updated for light theme)
// ==============================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

const interactables = document.querySelectorAll('a, button, .amenities-list li, .bento-item, .diferencial-card, .photo-item');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(36, 64, 38, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// ==============================
// SIMPLE LIGHTBOX (Home Page)
// ==============================
(function () {
  const photoItems = document.querySelectorAll('.photo-item');
  if (photoItems.length === 0) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Fechar">×</button>
    <img src="" alt="Galeria">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.photo-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();

// ==============================
// NAVBAR SCROLL EFFECT (UNTOUCHED LOGIC)
// ==============================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==============================
// ICEBERG-STYLE SCROLL PARALLAX
// ==============================

// Pin the hero — it stays put while user scrolls
ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: '+=100%',
    pin: true,
    pinSpacing: false, // Next section scrolls OVER the hero smoothly
});

// Scroll timeline: Parallax hero content up and fade out
const heroScrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=100%',
        scrub: true
    }
});

heroScrollTl.to('.hero-content', {
    y: -150,
    opacity: 0,
    ease: 'none'
});




// ==============================
// SCROLL REVEALS (Batching for better staggering)
// ==============================

// Batch reveal-up (most common)
ScrollTrigger.batch(".reveal-up", {
    onEnter: batch => gsap.to(batch, {
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: {
            each: 0.15,
            from: "start"
        }, 
        ease: "back.out(1.7)", 
        overwrite: true
    }),
    onLeaveBack: batch => gsap.set(batch, {
        opacity: 0, 
        y: 30, 
        scale: 0.98, 
        overwrite: true
    }),
    start: "top 92%", // Trigger even earlier
});

// Batch reveal-left
ScrollTrigger.batch(".reveal-left", {
    onEnter: batch => gsap.to(batch, {
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "back.out(1.4)", 
        overwrite: true
    }),
    onLeaveBack: batch => gsap.set(batch, {
        opacity: 0, 
        x: -30, 
        overwrite: true
    }),
    start: "top 92%",
});

// Batch reveal-right
ScrollTrigger.batch(".reveal-right", {
    onEnter: batch => gsap.to(batch, {
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "back.out(1.4)", 
        overwrite: true
    }),
    onLeaveBack: batch => gsap.set(batch, {
        opacity: 0, 
        x: 30, 
        overwrite: true
    }),
    start: "top 92%",
});

// ==============================
// AMENITIES INTERACTIVE LIST (Auto-cycle)
// ==============================
const amenitiesList = document.querySelector('.amenities-list');
const listItems = document.querySelectorAll('.amenities-list li');
const images = document.querySelectorAll('.stack-img');
let currentAmenityIndex = 0;
let amenityInterval;

function showAmenity(index) {
    listItems.forEach(li => li.classList.remove('active'));
    images.forEach(img => img.classList.remove('active'));
    
    listItems[index].classList.add('active');
    document.getElementById(`img-${index}`).classList.add('active');
    currentAmenityIndex = index;
}

function nextAmenity() {
    let nextIndex = (currentAmenityIndex + 1) % listItems.length;
    showAmenity(nextIndex);
}

function startAmenityCycle() {
    stopAmenityCycle();
    amenityInterval = setInterval(nextAmenity, 3000);
}

function stopAmenityCycle() {
    if (amenityInterval) {
        clearInterval(amenityInterval);
    }
}

// Hover interactions
listItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        stopAmenityCycle();
        showAmenity(index);
    });
});

// Resume when mouse leaves the list area
if (amenitiesList) {
    amenitiesList.addEventListener('mouseleave', () => {
        startAmenityCycle();
    });
}

// Start automatically
startAmenityCycle();

// ==============================
// STATS COUNTER ANIMATION
// ==============================
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    if (!target) return;

    ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            gsap.to({ val: 0 }, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function() {
                    const current = Math.round(this.targets()[0].val);
                    // Preserve the suffix span if it exists
                    const suffix = stat.querySelector('span');
                    if (suffix) {
                        stat.textContent = current;
                        stat.appendChild(suffix);
                    } else {
                        stat.textContent = current;
                    }
                }
            });
        }
    });
});

// ==============================
// SMOOTH SCROLL for nav links
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==============================
// MOBILE MENU
// ==============================
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        const isActive = mobileMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ==============================
// WHATSAPP BUTTON VISIBILITY
// ==============================
const whatsappBtn = document.getElementById('whatsappBtn');

if (whatsappBtn) {
    // Show after scrolling past hero
    ScrollTrigger.create({
        trigger: '.hero',
        start: 'bottom top',
        onEnter: () => whatsappBtn.classList.add('visible'),
        onLeaveBack: () => whatsappBtn.classList.remove('visible')
    });

    // Also show after 4 seconds as fallback
    setTimeout(() => {
        if (window.scrollY > 300) {
            whatsappBtn.classList.add('visible');
        }
    }, 4000);
}

// ==============================
// WORD REVEAL ANIMATIONS
// ==============================
const animatedHeadings = document.querySelectorAll('.animate-words');

animatedHeadings.forEach(heading => {
    const text = heading.textContent.trim();
    heading.textContent = '';
    
    // Split by words
    const words = text.split(' ');
    
    words.forEach((word, index) => {
        const wordWrapper = document.createElement('span');
        wordWrapper.style.display = 'inline-block';
        wordWrapper.style.overflow = 'hidden';
        wordWrapper.style.verticalAlign = 'top';
        
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        wordSpan.style.display = 'inline-block';
        wordSpan.style.transform = 'translateY(100%)';
        wordSpan.style.opacity = '0';
        
        wordWrapper.appendChild(wordSpan);
        heading.appendChild(wordWrapper);
        
        if (index < words.length - 1) {
            heading.appendChild(document.createTextNode(' '));
        }
    });

    ScrollTrigger.create({
        trigger: heading,
        start: "top 90%",
        onEnter: () => {
            gsap.to(heading.querySelectorAll('span > span'), {
                y: "0%",
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.4)",
                overwrite: true
            });
        },
        onLeaveBack: () => {
            gsap.set(heading.querySelectorAll('span > span'), {
                y: "100%",
                opacity: 0,
                overwrite: true
            });
        }
    });
});

// ==============================
// FLOATING NAV MENU
// ==============================
const floatingMenuBtn = document.getElementById('floatingMenuBtn');
const floatingNavOverlay = document.getElementById('floatingNavOverlay');

if (floatingMenuBtn && floatingNavOverlay) {
    // Show/hide button based on scroll position (after hero)
    ScrollTrigger.create({
        trigger: '.hero',
        start: 'bottom top',
        onEnter: () => {
            floatingMenuBtn.classList.add('visible');
            floatingMenuBtn.classList.add('on-light');
        },
        onLeaveBack: () => {
            floatingMenuBtn.classList.remove('visible');
            floatingMenuBtn.classList.remove('on-light');
            // Also close menu if open and scrolled back to hero
            if (floatingNavOverlay.classList.contains('active')) {
                closeFloatingMenu();
            }
        }
    });

    function openFloatingMenu() {
        floatingMenuBtn.classList.add('active');
        floatingNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeFloatingMenu() {
        floatingMenuBtn.classList.remove('active');
        floatingNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle on button click
    floatingMenuBtn.addEventListener('click', () => {
        if (floatingNavOverlay.classList.contains('active')) {
            closeFloatingMenu();
        } else {
            openFloatingMenu();
        }
    });

    // Close when clicking nav links
    floatingNavOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // For anchor links, smooth scroll
            if (href.startsWith('#')) {
                e.preventDefault();
                closeFloatingMenu();
                
                // Small delay for the close animation
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            } else {
                // External links (like galeria.html)
                closeFloatingMenu();
            }
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && floatingNavOverlay.classList.contains('active')) {
            closeFloatingMenu();
        }
    });

    // Close when clicking the background
    floatingNavOverlay.querySelector('.floating-nav-bg').addEventListener('click', closeFloatingMenu);
}

