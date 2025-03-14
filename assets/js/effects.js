document.addEventListener('DOMContentLoaded', function() {
    // Función para animar la aparición de los pisos al hacer scroll
    function animarEdificio() {
      const pisos = document.querySelectorAll('.piso');
      const edificioContainer = document.querySelector('.edificio-container');
      
      if (!edificioContainer) return;
      
      const edificioPosition = edificioContainer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (edificioPosition < windowHeight * 0.75) {
        // Animamos los pisos de abajo hacia arriba
        pisos.forEach((piso, index) => {
          setTimeout(() => {
            piso.style.opacity = '1';
            piso.style.transform = piso.classList.contains('terraza') ? 'translateZ(20px)' : 
                                   piso.classList.contains('piso-1') ? 'translateZ(15px)' : 
                                   piso.classList.contains('piso-2') ? 'translateZ(10px)' : 
                                   piso.classList.contains('piso-3') ? 'translateZ(5px)' : '';
          }, 300 * (pisos.length - index));
        });
      }
    }
    
    // Añadir efecto parallax al hacer scroll
    function parallaxEdificio() {
      const edificioContainer = document.querySelector('.edificio-container');
      if (!edificioContainer) return;
      
      const scrollPosition = window.scrollY;
      edificioContainer.style.transform = `translateY(${scrollPosition * 0.05}px) rotateX(${5 - scrollPosition * 0.01}deg)`;
    }
    
    // Efecto hover para los pisos
    const pisos = document.querySelectorAll('.piso');
    pisos.forEach(piso => {
      // Inicialmente ocultos para la animación
      piso.style.opacity = '0';
      piso.style.transform = 'translateY(50px)';
      piso.style.transition = 'all 0.5s ease';
      
      // Efecto al pasar el mouse
      piso.addEventListener('mouseenter', function() {
        this.style.transform = this.classList.contains('terraza') ? 'translateY(-15px) translateZ(25px)' : 
                              this.classList.contains('piso-1') ? 'translateY(-10px) translateZ(20px)' : 
                              this.classList.contains('piso-2') ? 'translateY(-10px) translateZ(15px)' : 
                              this.classList.contains('piso-3') ? 'translateY(-10px) translateZ(10px)' : 
                              'translateY(-5px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
      });
      
      piso.addEventListener('mouseleave', function() {
        this.style.transform = this.classList.contains('terraza') ? 'translateZ(20px)' : 
                              this.classList.contains('piso-1') ? 'translateZ(15px)' : 
                              this.classList.contains('piso-2') ? 'translateZ(10px)' : 
                              this.classList.contains('piso-3') ? 'translateZ(5px)' : '';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      });
    });
    
    // Ejecutar animación al cargar y al hacer scroll
    window.addEventListener('scroll', animarEdificio);
    window.addEventListener('scroll', parallaxEdificio);
    
    // Iniciar animación cuando se carga la página
    setTimeout(animarEdificio, 500);
  });