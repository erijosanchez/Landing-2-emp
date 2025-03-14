document.addEventListener('DOMContentLoaded', function () {
    const pisos = document.querySelectorAll('.piso');

    // Función para revelar los pisos cuando el usuario hace scroll
    function revelarProyectos() {
        const triggerPoint = window.innerHeight * 0.85;

        pisos.forEach(piso => {
            const pisoTop = piso.getBoundingClientRect().top;

            // Si el piso está dentro del área visible
            if (pisoTop < triggerPoint) {
                piso.classList.add('visible');
            }
        });
    }

    // Inicialmente ocultar los pisos para la animación
    pisos.forEach((piso, index) => {
        piso.style.opacity = '0';
        piso.style.transform = 'translateY(30px)';
        piso.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        piso.style.transitionDelay = `${index * 0.15}s`;
    });

    // Clase para controlar la visibilidad
    document.documentElement.style.setProperty('--stagger-delay', '0.15s');
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .piso.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      </style>
    `);

    // Añadir funcionalidad interactiva a los botones de proyecto
    pisos.forEach(piso => {
        const btn = piso.querySelector('.btn-proyecto');
        if (btn) {
            btn.addEventListener('mouseenter', function () {
                const flecha = this.querySelector('.flecha');
                if (flecha) {
                    flecha.style.transform = 'translateX(5px)';
                }
            });

            btn.addEventListener('mouseleave', function () {
                const flecha = this.querySelector('.flecha');
                if (flecha) {
                    flecha.style.transform = 'translateX(0)';
                }
            });
        }
    });

    // Efecto de enfoque en hover para cada piso
    pisos.forEach(piso => {
        piso.addEventListener('mouseenter', function () {
            // Aplicar un estado de enfoque al piso actual
            this.style.zIndex = '10';

            // Reducir ligeramente la opacidad de los demás pisos
            pisos.forEach(otroPiso => {
                if (otroPiso !== this) {
                    otroPiso.style.opacity = '0.85';
                }
            });
        });

        piso.addEventListener('mouseleave', function () {
            // Restaurar estado normal
            this.style.zIndex = '1';

            // Restaurar opacidad de todos los pisos
            pisos.forEach(otroPiso => {
                otroPiso.style.opacity = '1';
            });
        });
    });

    // Optimización para scroll y resize
    let scrollTimeout;
    function optimizedScroll() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function () {
                scrollTimeout = null;
                revelarProyectos();
            }, 66); // 15fps
        }
    }

    // Añadir indicador de scroll para móviles
    const edificioContainer = document.querySelector('.edificio-container');
    if (edificioContainer && window.innerWidth < 768) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '<span>Desliza para ver más</span><svg width="20" height="10" viewBox="0 0 20 10"><path d="M10 10L0 0h20z" fill="currentColor"/></svg>';
        scrollIndicator.style.cssText = `
        text-align: center;
        padding: 1rem;
        color: #666;
        font-size: 0.85rem;
        opacity: 0.8;
        animation: bounceDown 1.5s infinite;
        margin-bottom: 1rem;
      `;

        document.head.insertAdjacentHTML('beforeend', `
        <style>
          @keyframes bounceDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }
        </style>
      `);

        edificioContainer.prepend(scrollIndicator);

        // Ocultar indicador después de un tiempo
        setTimeout(() => {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                scrollIndicator.remove();
            }, 500);
        }, 5000);
    }

    // Analytics: Seguimiento de interacciones (solo como ejemplo)
    pisos.forEach(piso => {
        const btn = piso.querySelector('.btn-proyecto');
        if (btn) {
            btn.addEventListener('click', function () {
                const proyectoNombre = piso.querySelector('h3')?.textContent || 'Proyecto';
                // Aquí se podría integrar con sistemas de analytics
                console.log(`Click en proyecto: ${proyectoNombre}`);
            });
        }
    });

    // Mejora de rendimiento: Usar IntersectionObserver si está disponible
    if ('IntersectionObserver' in window) {
        const proyectosObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    proyectosObserver.unobserve(entry.target); // Dejar de observar una vez visible
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        pisos.forEach(piso => {
            proyectosObserver.observe(piso);
        });
    } else {
        // Fallback para navegadores antiguos
        window.addEventListener('scroll', optimizedScroll);
        window.addEventListener('resize', optimizedScroll);

        // Ejecutar inmediatamente para elementos visibles al cargar
        revelarProyectos();
    }

    // Ejecutar una vez para inicializar
    setTimeout(revelarProyectos, 300);
});