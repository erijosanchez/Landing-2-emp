window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', function () {
    navMenu.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Add loading animation
window.addEventListener('load', function () {
    document.body.style.opacity = '1';
});

// Service cards hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Projects hover effect
document.querySelectorAll('.piso').forEach(piso => {
    piso.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(15px) scale(1.02)';
    });

    piso.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0) scale(1)';
    });
});

// Add dynamic background to hero section
const hero = document.querySelector('.hero');
let mouseX = 0;
let mouseY = 0;

hero.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;

    this.style.background = `linear-gradient(${mouseX}deg, #667eea 0%, #764ba2 100%)`;
});

// Parallax effect for hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-image');
    if (parallax) {
        const speed = scrolled * 0.3;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Counter animation for statistics (if needed)
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 20);
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Add entrance animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 200);
});