gsap.registerPlugin(ScrollTrigger);

// ==============================
// VIDEO LOOP CONTROL (8s → 53s)
// ==============================
const heroVideo = document.getElementById('heroVideo');

function setupVideoLoop() {
    heroVideo.currentTime = 8;
    heroVideo.play();
    
    heroVideo.addEventListener('timeupdate', () => {
        if (heroVideo.currentTime >= 53) {
            heroVideo.currentTime = 8;
        }
    });
}

// ==============================
// ICEBERG-STYLE INTRO ANIMATION
// ==============================
(function() {
    const overlay = document.getElementById('introOverlay');
    const flashImgs = document.querySelectorAll('.flash-img');
    const heroTitle = document.getElementById('heroTitleGiant');
    const heroTagline = document.getElementById('heroTagline');
    const heroHandwritten = document.getElementById('heroHandwritten');
    const scrollInd = document.getElementById('scrollIndicator');
    const navbar = document.querySelector('.navbar');
    const scribblePaths = document.querySelectorAll('.scribble-path');
    const scribbles = document.querySelectorAll('.scribble');
    const heroScribbles = document.querySelectorAll('.hero-scribble');

    // Hide navbar during intro
    gsap.set(navbar, { opacity: 0, y: -40 });

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    // Calculate stroke lengths for scribble animation
    scribblePaths.forEach(path => {
        const length = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
    });


    const introTl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = '';
            overlay.classList.add('done');
            // Start video after intro
            setupVideoLoop();
        }
    });

    // Phase 1: Flash photos rapidly — ALL STRAIGHT (no rotation)
    const flashDuration = 0.15;
    const flashGap = 0.25;

    flashImgs.forEach((img, i) => {
        const startTime = i * flashGap;
        introTl
            .set(img, { 
                scale: 0.8, 
                rotation: 0 // Straight — no random rotation
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

    // Phase 1.5: Animate scribbles drawing themselves
    scribbles.forEach((scribble, i) => {
        const path = scribble.querySelector('.scribble-path');
        const delay = 0.2 + i * 0.3;
        introTl
            .to(scribble, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            }, delay)
            .to(path, {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: 'power2.inOut'
            }, delay);
    });

    // Phase 2: Show last image and hold
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

    // Phase 3: Expand the photo to fullscreen
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
        }, holdStart + 0.5)
        // Fade out scribbles during expansion
        .to(scribbles, {
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.in'
        }, holdStart + 0.8);

    // Phase 4: Fade out overlay to reveal the hero video
    introTl
        .to(overlay, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        }, holdStart + 1.6);

    // Phase 5: Animate handwritten text (fade in + slide up)
    introTl
        .to(heroHandwritten, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, holdStart + 2.0);

    // Phase 6: Animate main title and elements
    introTl
        .to(heroTitle, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out'
        }, holdStart + 3.0)
        .to(heroTagline, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, holdStart + 3.4)
        // Hero scribble decorations
        .to(heroScribbles, {
            opacity: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        }, holdStart + 3.2);
    
    // Animate hero scribble paths drawing
    heroScribbles.forEach((scribble) => {
        const path = scribble.querySelector('.scribble-path');
        if (path) {
            const length = path.getTotalLength ? path.getTotalLength() : 1000;
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            introTl.to(path, {
                strokeDashoffset: 0,
                duration: 1.8,
                ease: 'power2.inOut'
            }, holdStart + 3.2);
        }
    });

    introTl
        .to(scrollInd, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, holdStart + 3.8)
        .to(navbar, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, holdStart + 3.6);

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
// CURTAIN SCROLL EFFECT (Hero → Concept)
// ==============================
const curtainStrips = document.querySelectorAll('.curtain-strip');

// Phase 1: Curtains come down (covering the screen)
const curtainTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.hero',
        start: 'bottom 90%',
        end: 'bottom 10%',
        scrub: 0.8,
    }
});

// Curtains scale in from top with stagger
curtainTl.to(curtainStrips, {
    scaleY: 1,
    duration: 0.5,
    stagger: {
        each: 0.05,
        from: 'edges'
    },
    ease: 'power2.inOut'
});

// Phase 2: Curtains go up (revealing concept section)
const curtainRevealTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#conceito',
        start: 'top 95%',
        end: 'top 40%',
        scrub: 0.8,
    }
});

curtainRevealTl.to(curtainStrips, {
    scaleY: 0,
    transformOrigin: 'bottom center',
    duration: 0.5,
    stagger: {
        each: 0.05,
        from: 'center'
    },
    ease: 'power2.inOut'
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

// ==============================
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
