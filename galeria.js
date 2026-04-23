gsap.registerPlugin(ScrollTrigger);

// ==============================
// SCROLL REVEALS
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    // Header reveal
    gsap.from(".gallery-header h1, .gallery-header p", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
    });

    // Grid items reveal
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
});

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
  document.querySelectorAll('.photo-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = item.querySelector('img');
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
// CUSTOM CURSOR
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
    .querySelectorAll('a, button, .photo-item')
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

// ==============================
// MOBILE MENU & FLOATING MENU UNIFICATION
// ==============================
const mobileToggle = document.getElementById('mobileToggle');
const floatingMenuBtn = document.getElementById('floatingMenuBtn');
const floatingNavOverlay = document.getElementById('floatingNavOverlay');

if (floatingNavOverlay) {
    function openMenu() {
        if (floatingMenuBtn) floatingMenuBtn.classList.add('active');
        if (mobileToggle) mobileToggle.classList.add('active');
        floatingNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Ensure icons are rendered
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function closeMenu() {
        if (floatingMenuBtn) floatingMenuBtn.classList.remove('active');
        if (mobileToggle) mobileToggle.classList.remove('active');
        floatingNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        if (floatingNavOverlay.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Navbar Toggle (Mobile)
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    // Floating Button Toggle
    if (floatingMenuBtn) {
        floatingMenuBtn.addEventListener('click', toggleMenu);
    }

    // Close on link click
    floatingNavOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.includes('#') && !href.startsWith('http')) {
                const parts = href.split('#');
                const id = parts[parts.length - 1];
                const target = document.getElementById(id);
                
                if (target) {
                    if (!href.includes('.html') || window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                        e.preventDefault();
                        closeMenu();
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 300);
                    }
                }
            } else {
                closeMenu();
            }
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && floatingNavOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close on background click
    const navBg = floatingNavOverlay.querySelector('.floating-nav-bg');
    if (navBg) navBg.addEventListener('click', closeMenu);
}
