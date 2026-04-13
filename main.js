gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
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

// Cursor changes on hover
const interactables = document.querySelectorAll('a, button, .amenities-list li, .bento-item');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(176, 137, 104, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero Animation
const heroTimeline = gsap.timeline();

heroTimeline.to('.hero-title .word', {
    y: 0,
    duration: 1.2,
    stagger: 0.1,
    ease: 'power4.out',
    delay: 0.2
})
.from('.hero-subtitle', {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: 'power3.out'
}, "-=0.8")
.from('.hero-desc', {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: 'power3.out'
}, "-=0.6")
.from('.scroll-indicator', {
    opacity: 0,
    duration: 1
}, "-=0.2");

// Hero Parallax Scroll
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

// Reveal Elements
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

// Amenities Interactive List
const listItems = document.querySelectorAll('.amenities-list li');
const images = document.querySelectorAll('.stack-img');

listItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        // Remove active from all
        listItems.forEach(li => li.classList.remove('active'));
        images.forEach(img => img.classList.remove('active'));
        
        // Add active to current
        item.classList.add('active');
        const index = item.getAttribute('data-index');
        document.getElementById(`img-${index}`).classList.add('active');
    });
});

// Pin Amenities Area on Desktop
ScrollTrigger.matchMedia({
    "(min-width: 901px)": function() {
        ScrollTrigger.create({
            trigger: ".amenities",
            start: "top top",
            end: "+=50%",
            pin: ".pin-content",
            scrub: true
        });
    }
});
