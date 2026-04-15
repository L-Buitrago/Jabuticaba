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
    const expandBox = document.getElementById('expandBox');
    const expandFrame = document.getElementById('expandFrame');
    const heroTitle = document.getElementById('heroTitleGiant');
    const heroTagline = document.getElementById('heroTagline');
    const heroHandwritten = document.getElementById('heroHandwritten');
    const scrollInd = document.getElementById('scrollIndicator');
    const navbar = document.querySelector('.navbar');
    const curtainSlices = document.querySelectorAll('.curtain-slice');
    
    // Only SVG scribbles that are left are the ones in the phrase and pen test
    const scribblePaths = document.querySelectorAll('.scribble-path, .pen-test-path');

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

    // Random scribbles removed as per request.

    // Phase 2: Show last image and hold momentarily
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

    // Phase 3: Hide flash photos, reveal expand box, and slide curtain down
    const curtainDropTime = holdStart + 0.6;
    
    // Flash photos disappear into white expanding box
    introTl
        .set('.flash-photos', { opacity: 0 }, curtainDropTime)
        .set(expandBox, { opacity: 1 }, curtainDropTime)
        // Expand the tiny white box very fast to fill the screen
        .to(expandBox, {
            width: '100vw',
            height: '100vh',
            duration: 0.8,
            ease: "expo.in"
        }, curtainDropTime);

    // Right after white flash, the curtain falls over it while video starts playing underneath
    introTl
        .set(expandFrame, { opacity: 1 }, curtainDropTime + 0.8) // Reveal video
        .set(overlay, { 
            background: 'transparent',
            pointerEvents: 'none'
        }, curtainDropTime + 0.8)
        .set(expandBox, { opacity: 0 }, curtainDropTime + 0.8); // Hide white box

    // Curtain drop transition (from top to bottom staggered)
    introTl.to(curtainSlices, {
        scaleY: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.inOut',
        transformOrigin: 'top'
    }, curtainDropTime + 0.2);

    // Phase 4: Curtain pulls UP to reveal the hero section underneath
    const curtainPullTime = curtainDropTime + 1.2;
    introTl.to(curtainSlices, {
        scaleY: 0,
        duration: 0.8,
        stagger: {
            amount: 0.3,
            from: "center"
        },
        ease: 'power4.inOut',
        transformOrigin: 'bottom'
    }, curtainPullTime);

    // Cleanup phase
    introTl.to(overlay, {
        opacity: 0,
        duration: 0.1
    }, curtainPullTime + 1.2);

    // Phase 5: Animate handwritten text (fade in + slide up)
    const afterCurtain = curtainPullTime + 0.4;
    introTl
        .to(heroHandwritten, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, afterCurtain);

    // Phase 6: Animate main title and elements
    introTl
        .to(heroTitle, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out'
        }, afterCurtain + 0.4)
    
    // Draw the Iceberg-style phrase scribbles (circle, underline, and pen test)
    const phraseScribbles = document.querySelectorAll('.scribble-path, .pen-test-path');
    phraseScribbles.forEach((path, i) => {
        const length = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        introTl.to(path, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power3.inOut'
        }, afterCurtain + 0.5 + (i * 0.3));
    });

    introTl
        .to(scrollInd, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, afterCurtain + 1.5)
        .to(navbar, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, afterCurtain + 1.2);

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
// ICEBERG-STYLE SCROLL PINNING
// ==============================

// 1. We pin the Hero section completely so it stays while you scroll
ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: '+=100%',     // Keeps it pinned for 1 viewport height
    pin: true,
    pinSpacing: false, // False means the next section will scroll OVER it!
});

// 2. As we scroll, we fade the hero overlay to pitch black to mimic a clean curtain effect
gsap.to('.hero-overlay', {
    background: 'linear-gradient(to top, rgba(8,18,10,1) 0%, rgba(8,18,10,1) 100%)',
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=100%',
        scrub: true,
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
