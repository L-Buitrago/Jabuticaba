gsap.registerPlugin(ScrollTrigger);

// ==============================
// ICEBERG-STYLE INTRO ANIMATION
// ==============================
(function() {
    const overlay = document.getElementById('introOverlay');
    const flashImgs = document.querySelectorAll('.flash-img');
    const heroVideo = document.getElementById('heroVideo');
    const heroTitle = document.getElementById('heroTitleGiant');
    const heroTagline = document.getElementById('heroTagline');
    const scrollInd = document.getElementById('scrollIndicator');
    const navbar = document.querySelector('.navbar');

    // Hide navbar during intro
    gsap.set(navbar, { opacity: 0, y: -40 });

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    const introTl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = '';
            overlay.classList.add('done');
        }
    });

    // Phase 1: Flash photos rapidly (like Iceberg)
    // Each photo appears small in the center, with staggered timing
    const flashDuration = 0.15;
    const flashGap = 0.25;

    flashImgs.forEach((img, i) => {
        const startTime = i * flashGap;
        // Each image: scale up from small, flash visible, then disappear
        introTl
            .set(img, { 
                scale: 0.8, 
                rotation: (Math.random() - 0.5) * 15 // Slight random rotation
            }, startTime)
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

    // Phase 2: Show last image and hold it
    const lastImg = flashImgs[flashImgs.length - 1];
    const holdStart = flashImgs.length * flashGap + 0.1;

    introTl
        .to(lastImg, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
        }, holdStart);

    // Phase 3: Expand the photo to fullscreen & crossfade to video
    introTl
        .to('.flash-photos', {
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
            duration: 1.4,
            ease: 'power3.inOut'
        }, holdStart + 0.5)
        .to(lastImg, {
            borderRadius: 0,
            duration: 1.4,
            ease: 'power3.inOut'
        }, holdStart + 0.5);

    // Phase 4: Fade out overlay to reveal the hero video underneath
    introTl
        .to(overlay, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        }, holdStart + 1.6);

    // Phase 5: Animate in the giant title
    introTl
        .to(heroTitle, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out'
        }, holdStart + 2.0)
        .to(heroTagline, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, holdStart + 2.4)
        .to(scrollInd, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, holdStart + 2.8)
        .to(navbar, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, holdStart + 2.6);

})();

// ==============================
// CUSTOM CURSOR
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

const interactables = document.querySelectorAll('a, button, .amenities-list li, .bento-item');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(194, 168, 120, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// ==============================
// NAVBAR SCROLL EFFECT
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
// HERO PARALLAX
// ==============================
gsap.to('.hero-bg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// ==============================
// SCROLL REVEALS
// ==============================
const revealElements = document.querySelectorAll('.reveal-up');
revealElements.forEach(el => {
    gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.from('.reveal-left', {
    x: -50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%'
    }
});

gsap.from('.reveal-right', {
    x: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%'
    }
});

// AMENITIES INTERACTIVE LIST
// ==============================
const listItems = document.querySelectorAll('.amenities-list li');
const images = document.querySelectorAll('.stack-img');

listItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        listItems.forEach(li => li.classList.remove('active'));
        images.forEach(img => img.classList.remove('active'));
        
        item.classList.add('active');
        const index = item.getAttribute('data-index');
        document.getElementById(`img-${index}`).classList.add('active');
    });
});
