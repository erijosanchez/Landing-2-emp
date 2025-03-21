document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('nav ul li a');
    // Variable para almacenar todas las secciones
    let sections = [];
    
    // Función para actualizar el estado activo
    function setActiveLink() {
        // Obtener la ruta actual
        const currentPath = window.location.pathname;
        // Obtener el hash actual (para enlaces internos)
        const currentHash = window.location.hash;
        
        // Recorrer todos los enlaces
        navLinks.forEach(link => {
            // Quitar la clase active de todos los enlaces
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            
            // Verificar si es un enlace interno (comienza con #)
            if (href.startsWith('#')) {
                // Si estamos en la página principal y el hash coincide con el enlace
                if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.length === 0) {
                    if ((currentHash === href) || 
                        (currentHash === '' && href === '#inicio')) {
                        link.classList.add('active');
                    }
                }
            } 
            // Verificar si es un enlace a sección interna desde página externa
            else if (href.includes('#') && !href.startsWith('#')) {
                // Por ejemplo: href="/index.html#proyectos"
                const parts = href.split('#');
                const linkPath = parts[0];
                const linkHash = '#' + parts[1];
                
                // Si la ruta coincide y el hash coincide
                if (currentPath.endsWith(linkPath) && currentHash === linkHash) {
                    link.classList.add('active');
                }
            }
            // Verificar si es un enlace externo normal
            else {
                // Si la ruta actual termina con el href del enlace
                if (currentPath.endsWith(href) || 
                    (currentPath === '/' && href === '/index.html')) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    // Función para inicializar las secciones para detección de scroll
    function initSections() {
        sections = [];
        // Recopilamos todas las secciones referenciadas por los enlaces de navegación
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    sections.push({
                        id: href,
                        element: section,
                        link: link
                    });
                }
            } else if (href.includes('#') && !href.startsWith('#')) {
                const parts = href.split('#');
                const linkHash = '#' + parts[1];
                if (window.location.pathname.endsWith(parts[0]) || 
                    (window.location.pathname === '/' && parts[0] === '/index.html')) {
                    const section = document.querySelector(linkHash);
                    if (section) {
                        sections.push({
                            id: linkHash,
                            element: section,
                            link: link
                        });
                    }
                }
            }
        });
    }
    
    // Función para actualizar el menú al hacer scroll
    function handleScroll() {
        // Si no estamos en la página principal, no hacemos nada
        if (!window.location.pathname.endsWith('index.html') && 
            window.location.pathname !== '/' && 
            window.location.pathname.length !== 0) {
            return;
        }
        
        // Obtenemos la posición actual del scroll con un pequeño offset
        const scrollPosition = window.scrollY + 100; // 100px de offset para mejorar la detección
        
        // Encontramos la sección visible actual
        let currentSection = null;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i].element;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Si el scroll está dentro de esta sección
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = sections[i].id;
                break;
            }
        }
        
        // Si estamos al final de la página, seleccionamos la última sección
        if (!currentSection && window.innerHeight + scrollPosition >= document.body.offsetHeight - 5) {
            currentSection = sections[sections.length - 1].id;
        }
        
        // Actualizamos las clases active en los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection || 
                link.getAttribute('href').endsWith(currentSection)) {
                link.classList.add('active');
                // Actualizamos la URL sin causar recarga (opcional)
                history.replaceState(null, null, currentSection);
            }
        });
    }
    
    // Añadir desplazamiento suave para enlaces internos
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Si es un enlace interno (#seccion) y estamos en la misma página
        if (href.startsWith('#') && 
            (window.location.pathname.endsWith('index.html') || 
             window.location.pathname === '/' || 
             window.location.pathname.length === 0)) {
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Actualizar la URL sin causar recarga
                    history.pushState(null, null, targetId);
                    
                    // Desplazamiento suave a la sección
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Actualizar el enlace activo
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        }
        // Si es un enlace interno (#seccion) y estamos en otra página
        else if (href.startsWith('#') && 
                !window.location.pathname.endsWith('index.html') && 
                window.location.pathname !== '/' && 
                window.location.pathname.length !== 0) {
            
            // Modificar el enlace para que vaya a index.html#seccion
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '/index.html' + href;
            });
        }
    });
    
    // Comprobar si se accede directamente a una sección desde otra página
    if (window.location.hash && 
        (window.location.pathname.endsWith('index.html') || 
         window.location.pathname === '/' || 
         window.location.pathname.length === 0)) {
        
        // Pequeño retraso para asegurar que la página se ha cargado completamente
        setTimeout(function() {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
    
    // Inicializar las secciones para detección de scroll
    initSections();
    
    // Establecer el enlace activo al cargar la página
    setActiveLink();
    
    // Actualizar cuando cambia el hash (navegación interna)
    window.addEventListener('hashchange', setActiveLink);
    
    // Añadir el evento de scroll para detectar la sección actual
    window.addEventListener('scroll', handleScroll);
    
    // Ejecutar una vez para establecer la sección inicial
    handleScroll();
});