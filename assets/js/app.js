document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.classList.add('mobile-menu-toggle');
    mobileMenuToggle.innerHTML = '☰'; // Hamburger menu icon
    
    // Correctly insert the mobile menu toggle button
    if (nav && navUl) {
        nav.insertBefore(mobileMenuToggle, navUl);

        mobileMenuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
            mobileMenuToggle.innerHTML = navUl.classList.contains('active') ? '✕' : '☰';
        });

        // Close mobile menu when a nav link is clicked
        navUl.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navUl.classList.remove('active');
                mobileMenuToggle.innerHTML = '☰';
            }
        });
    }

    // Project Gallery Interaction
    const projectsGallery = document.querySelector('.projects-gallery');
    const projectImages = [
        { title: 'Torre Moderna', image: 'project1.jpg' },
        { title: 'Complejo Residencial', image: 'project2.jpg' },
        { title: 'Oficinas Corporativas', image: 'project3.jpg' }
    ];

    if (projectsGallery) {
        projectImages.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                </div>
            `;
            projectsGallery.appendChild(projectCard);
        });
    }

    // Form Submission Handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Gracias por tu mensaje. Nos pondremos en contacto pronto.');
            contactForm.reset();
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Particle Animation (with safety checks)
    const svg = document.getElementById('particleCanvas');
    if (svg) {
        const starsGroup = svg;
        const linesGroup = svg;
        const starCount = 10;
        let selectedStars = [];

        function createStar(x, y) {
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            star.setAttribute('class', 'star');
            star.setAttribute('cx', x);
            star.setAttribute('cy', y);
            star.setAttribute('r', '12');
            star.addEventListener('click', handleStarClick);
            return star;
        }

        function handleStarClick(e) {
            const star = e.target;
            star.classList.toggle('selected');
            if (selectedStars.includes(star)) {
                selectedStars = selectedStars.filter(s => s !== star);
            } else {
                selectedStars.push(star);
            }
            
            if(selectedStars.length === 2) {
                connectStars(selectedStars);
                selectedStars = [];
            }
        }

        function connectStars(stars) {
            const [a, b] = stars;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const path = `M ${a.getAttribute('cx')} ${a.getAttribute('cy')} L ${b.getAttribute('cx')} ${b.getAttribute('cy')}`;
            line.setAttribute('d', path);
            line.setAttribute('class', 'constellation-line');
            linesGroup.appendChild(line);
        }

        class Particle {
            constructor() {
                // Safety check to ensure SVG exists
                const svgElement = document.getElementById('particleCanvas');
                if (!svgElement) return null;

                this.element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                this.size = Math.random() * 5 + 2;
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.velocityX = Math.random() * 2 - 1;
                this.velocityY = Math.random() * 2 - 1;
                
                this.element.setAttribute('r', this.size);
                this.element.setAttribute('fill', `hsl(${Math.random() * 360}, 70%, 50%)`);
                svgElement.appendChild(this.element);
            }

            update(mouseX, mouseY) {
                if (!this.element) return;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = -1000 / (distance * distance);

                if (distance < 100) {
                    this.velocityX += force * dx / distance;
                    this.velocityY += force * dy / distance;
                }

                this.velocityX *= 0.99;
                this.velocityY *= 0.99;
                this.x += this.velocityX;
                this.y += this.velocityY;

                this.element.setAttribute('cx', this.x);
                this.element.setAttribute('cy', this.y);
            }
        }

        // Only create particles if SVG exists
        const particles = Array.from({ length: 100 }, () => {
            const particle = new Particle();
            return particle || null;
        }).filter(p => p !== null);

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            if (particles.length > 0) {
                particles.forEach(particle => particle.update(mouseX, mouseY));
                requestAnimationFrame(animate);
            }
        }

        window.addEventListener('resize', () => {
            const svgElement = document.getElementById('particleCanvas');
            if (svgElement) {
                svgElement.setAttribute('width', window.innerWidth);
                svgElement.setAttribute('height', window.innerHeight);
            }
        });

        // Initialize random stars
        for(let i = 0; i < starCount; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            starsGroup.appendChild(createStar(x, y));
        }

        // Reset button functionality
        const resetButton = document.getElementById('reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                linesGroup.innerHTML = '';
                document.querySelectorAll('.star').forEach(star => {
                    star.classList.remove('selected');
                });
                selectedStars = [];
            });
        }

        animate();
    }
});