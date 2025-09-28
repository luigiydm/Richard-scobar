(function($) {
    'use strict';

    // ========================================
    // Variables globales
    // ========================================
    let isMenuOpen = false;
    let lastScrollTop = 0;
    let ticking = false;

    // ========================================
    // Enhanced Mobile Menu
    // ========================================
    const MobileMenu = function() {
        const toggleButton = $('.header-menu-toggle');
        const nav = $('.header-nav-wrap');
        const navLinks = nav.find('a');
        const body = $('body');

        // Toggle menu
        toggleButton.on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            isMenuOpen = !isMenuOpen;
            toggleButton.toggleClass('is-clicked');

            if (isMenuOpen) {
                nav.addClass('mobile').fadeIn(300);
                body.addClass('menu-open').css('overflow', 'hidden');
                toggleButton.attr('aria-expanded', 'true');
            } else {
                nav.removeClass('mobile').fadeOut(300);
                body.removeClass('menu-open').css('overflow', '');
                toggleButton.attr('aria-expanded', 'false');
            }
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.on("click", function() {
            if (nav.hasClass('mobile')) {
                isMenuOpen = false;
                toggleButton.removeClass('is-clicked').attr('aria-expanded', 'false');
                nav.removeClass('mobile').fadeOut(300);
                body.removeClass('menu-open').css('overflow', '');
            }
        });

        // Cerrar menú al hacer clic fuera
        $(document).on('click', function(event) {
            if (isMenuOpen && !$(event.target).closest('.header-wrap').length) {
                isMenuOpen = false;
                toggleButton.removeClass('is-clicked').attr('aria-expanded', 'false');
                nav.removeClass('mobile').fadeOut(300);
                body.removeClass('menu-open').css('overflow', '');
            }
        });

        // Cerrar menú con tecla ESC
        $(document).on('keydown', function(event) {
            if (event.key === 'Escape' && isMenuOpen) {
                isMenuOpen = false;
                toggleButton.removeClass('is-clicked').attr('aria-expanded', 'false');
                nav.removeClass('mobile').fadeOut(300);
                body.removeClass('menu-open').css('overflow', '');
            }
        });
    };

    // ========================================
    // Enhanced Header Scroll Effects
    // ========================================
    const HeaderScroll = function() {
        const header = $('.header-wrap');

        function updateHeader() {
            const currentScroll = $(window).scrollTop();

            // Agregar clase scrolled
            if (currentScroll > 50) {
                header.addClass('scrolled');
            } else {
                header.removeClass('scrolled');
            }

            // Ocultar/mostrar header
            if (currentScroll > lastScrollTop && currentScroll > 100) {
                header.addClass('hidden');
            } else {
                header.removeClass('hidden');
            }

            lastScrollTop = currentScroll;
            ticking = false;
        }

        $(window).on('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    };

    // ========================================
    // Enhanced Hero Slider with Performance Optimizations
    // ========================================
    const HeroSlider = function() {
        if (typeof Swiper !== 'undefined' && $('.heroSwiper').length) {
            console.log('🎬 Iniciando Enhanced Hero Slider...');

            const heroSwiper = new Swiper('.heroSwiper', {
                loop: true,
                effect: 'fade',
                speed: 1500,
                allowTouchMove: true,
                simulateTouch: true,
                touchStartPreventDefault: false,
                autoplay: {
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                    waitForTransition: true,
                },
                fadeEffect: {
                    crossFade: true
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: false,
                    dynamicMainBullets: 3,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                mousewheel: {
                    invert: false,
                    sensitivity: 1,
                    thresholdTime: 500,
                    releaseOnEdges: true,
                },
                // Enhanced performance settings
                watchSlidesProgress: true,
                watchSlidesVisibility: true,
                preloadImages: false,
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 2,
                },
                on: {
                    init: function() {
                        console.log('✅ Enhanced Hero Slider inicializado');
                        // Mostrar el primer caption
                        setTimeout(() => {
                            $('.swiper-slide-active .caption-content').addClass('visible');
                        }, 500);
                    },
                    slideChangeTransitionStart: function() {
                        // Ocultar todos los captions
                        $('.caption-content').removeClass('visible');
                    },
                    slideChangeTransitionEnd: function() {
                        // Mostrar caption del slide activo
                        setTimeout(() => {
                            $('.swiper-slide-active .caption-content').addClass('visible');
                        }, 300);
                    },
                    autoplayTimeLeft: function(s, time, progress) {
                        // Opcional: mostrar progreso en pagination
                        const progressElement = $('.swiper-pagination-bullet-active');
                        if (progressElement.length) {
                            progressElement.css('background',
                                `conic-gradient(rgba(255,255,255,0.8) ${progress * 360}deg, rgba(255,255,255,0.3) 0deg)`
                            );
                        }
                    }
                }
            });

            // Pause en hover
            $('.heroSwiper').hover(
                function() { heroSwiper.autoplay.stop(); },
                function() { heroSwiper.autoplay.start(); }
            );

            return heroSwiper;
        } else {
            console.warn('⚠️ Swiper no disponible o elemento .heroSwiper no encontrado');
        }
    };

    // ========================================
    // Smooth Scroll para navegación
    // ========================================
    const SmoothScroll = function() {
        $('a[href*="#"]:not([href="#"])').on('click', function(e) {
            const target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                const headerHeight = $('.header-wrap').outerHeight();
                $('html, body').animate({
                    scrollTop: target.offset().top - headerHeight
                }, 800, 'easeInOutQuad');

                // Update active nav
                $('.nav-link').removeClass('active');
                $('.nav-link[href="' + this.getAttribute('href') + '"]').addClass('active');
            }
        });
    };

    // ========================================
    // Active Section Detection
    // ========================================
    const ActiveSection = function() {
        const sections = $('section[id]');
        const navLinks = $('.nav-link');

        if (sections.length === 0) return;

        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            const headerHeight = $('.header-wrap').outerHeight();

            sections.each(function() {
                const section = $(this);
                const sectionTop = section.offset().top - headerHeight - 100;
                const sectionBottom = sectionTop + section.outerHeight();

                if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                    const sectionId = section.attr('id');
                    navLinks.removeClass('active');
                    navLinks.filter(`[href="#${sectionId}"], [href*="#${sectionId}"]`).addClass('active');
                }
            });
        });
    };

    // ========================================
    // Animaciones de scroll
    // ========================================
    const ScrollAnimations = function() {
        if ('IntersectionObserver' in window) {
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        // Opcional: desconectar después de animar
                        fadeObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Elementos a animar
            document.querySelectorAll('.location-card, .stat-item, .statement-content').forEach(el => {
                fadeObserver.observe(el);
            });
        }
    };

    // ========================================
    // Enhanced Location Cards
    // ========================================
    const LocationCards = function() {
        $('.location-card').each(function() {
            const card = $(this);

            // Parallax effect en hover
            card.on('mouseenter', function() {
                const img = card.find('img');
                img.css('transform', 'scale(1.1) translateZ(0)');
            });

            card.on('mouseleave', function() {
                const img = card.find('img');
                img.css('transform', 'scale(1) translateZ(0)');
            });

            // Click tracking
            card.on('click', function(e) {
                const location = card.data('location');
                console.log(`🎯 Navegando a galería: ${location}`);

                // Analytics tracking si está disponible
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'navigation',
                        event_label: `gallery-${location}`
                    });
                }
            });
        });
    };

    // ========================================
    // Lazy Loading para imágenes
    // ========================================
    const LazyLoading = function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Solo aplicar lazy loading si la imagen tiene data-src
                        if (img.dataset.src) {
                            // Mostrar skeleton loading
                            img.style.opacity = '0';
                            img.style.transition = 'opacity 0.3s ease';

                            img.addEventListener('load', function() {
                                img.style.opacity = '1';
                                img.classList.add('image-loaded');
                            });

                            // Cargar imagen
                            img.src = img.dataset.src;
                        } else {
                            // Si no tiene data-src, asegurar que sea visible
                            img.style.opacity = '1';
                            img.classList.add('image-loaded');
                        }

                        observer.unobserve(img);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px'
            });

            // Solo observar imágenes que realmente necesitan lazy loading
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };

    // ========================================
    // Enhanced Performance Optimizations
    // ========================================
    const PerformanceOptimizations = function() {
        // Preload next page resources on hover with throttling
        const preloadedUrls = new Set();
        $('a[href]').on('mouseenter', Utils.throttle(function() {
            const href = $(this).attr('href');
            if (href && href.endsWith('.html') && !href.startsWith('http') && !preloadedUrls.has(href)) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = href;
                document.head.appendChild(prefetchLink);
                preloadedUrls.add(href);
            }
        }, 500));

        // Optimized scroll event handling
        let ticking = false;
        const updateScrollElements = function() {
            // Batch all scroll-dependent updates
            $(window).trigger('scroll.optimized');
            ticking = false;
        };

        $(window).on('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        });

        // Optimizar resize events con debounce mejorado
        let resizeTimer;
        const handleResize = Utils.debounce(function() {
            $(window).trigger('resize.optimized');

            // Update viewport-dependent calculations
            const viewport = Utils.getViewportSize();
            document.documentElement.style.setProperty('--vh', `${viewport.height * 0.01}px`);
        }, 250);

        $(window).on('resize', handleResize);

        // Critical resource hints with error handling
        const criticalImages = [
            'images/background/Slider.jpg',
            'images/background/banner5.jpg',
            'images/background/banner6.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            link.onload = () => console.log(`✅ Preloaded: ${src}`);
            link.onerror = () => console.warn(`⚠️ Failed to preload: ${src}`);
            document.head.appendChild(link);
        });

        // Intersection Observer polyfill fallback
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver not supported, loading polyfill');
            const script = document.createElement('script');
            script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
            document.head.appendChild(script);
        }
    };

    // ========================================
    // Accessibility Enhancements
    // ========================================
    const AccessibilityEnhancements = function() {
        // Focus management
        $(document).on('keydown', function(e) {
            if (e.key === 'Tab') {
                $('body').addClass('using-keyboard');
            }
        });

        $(document).on('mousedown', function() {
            $('body').removeClass('using-keyboard');
        });

        // Skip link functionality
        $('.skip-link').on('click', function(e) {
            e.preventDefault();
            const target = $($(this).attr('href'));
            if (target.length) {
                target.focus();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 300);
            }
        });

        // ARIA live announcements
        const announceToScreenReader = function(message) {
            const announcement = $('<div class="sr-only" aria-live="polite" aria-atomic="true"></div>').text(message);
            $('body').append(announcement);
            setTimeout(() => announcement.remove(), 1000);
        };

        // Announce page changes
        if (window.location.hash) {
            setTimeout(() => {
                announceToScreenReader(`Navegando a sección ${window.location.hash.substring(1)}`);
            }, 500);
        }
    };

    // ========================================
    // Error Handling
    // ========================================
    const ErrorHandling = function() {
        window.addEventListener('error', function(e) {
            console.error('❌ Error capturado:', e.error);
        });

        // Fallbacks para funcionalidades críticas
        if (typeof Swiper === 'undefined') {
            console.warn('⚠️ Swiper no está disponible');
        }

        // Verificar elementos críticos
        setTimeout(function() {
            const criticalElements = ['.heroSwiper', '.header-wrap'];
            criticalElements.forEach(selector => {
                if ($(selector).length === 0) {
                    console.warn(`⚠️ Elemento crítico no encontrado: ${selector}`);
                }
            });
        }, 1000);
    };

    // ========================================
    // Enhanced Stats Counter Animation
    // ========================================
    const StatsCounter = function() {
        const counters = $('.stat-number');

        if (counters.length === 0) return;

        const countUp = function(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    start = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(start) + (target >= 20 ? '+' : '');
            }, 16);
        };

        // Intersection Observer para animar cuando sea visible
        if ('IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.textContent);

                        setTimeout(() => {
                            countUp(counter, target);
                        }, Math.random() * 200); // Stagger animation

                        statsObserver.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });

            counters.each(function() {
                statsObserver.observe(this);
            });
        }
    };

    // ========================================
    // Utils y Helpers
    // ========================================
    const Utils = {
        // Debounce function
        debounce: function(func, wait, immediate) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        // Throttle function
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check viewport size
        getViewportSize: function() {
            return {
                width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
            };
        },

        // Enhanced device detection
        isMobile: function() {
            return Utils.getViewportSize().width <= 768;
        },

        // Touch device detection
        isTouchDevice: function() {
            return (('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   (navigator.msMaxTouchPoints > 0));
        },

        // Passive event listener support
        supportsPassive: function() {
            let passiveSupported = false;
            try {
                const options = {
                    get passive() {
                        passiveSupported = true;
                        return false;
                    }
                };
                window.addEventListener("test", null, options);
                window.removeEventListener("test", null, options);
            } catch(err) {
                passiveSupported = false;
            }
            return passiveSupported;
        }
    };

    // ========================================
    // Inicialización Principal
    // ========================================
    $(document).ready(function() {
        console.log('🎨 Richard Escobar v2.0 - Enhanced Portfolio Initializing...');
        const startTime = performance.now();

        try {
            // Core functionality - Critical path
            ErrorHandling();
            MobileMenu();
            HeaderScroll();

            // Enhanced features initialization
            const initPromises = [];

            // Hero Slider (Priority 1)
            if (typeof Swiper !== 'undefined') {
                initPromises.push(Promise.resolve(HeroSlider()));
            } else {
                console.warn('⚠️ Swiper not available, hero slider disabled');
            }

            // Navigation and UX (Priority 2)
            SmoothScroll();
            ActiveSection();

            // Visual enhancements (Priority 3)
            ScrollAnimations();
            LocationCards();
            LazyLoading();
            StatsCounter();

            // Performance and accessibility (Background)
            setTimeout(() => {
                PerformanceOptimizations();
                AccessibilityEnhancements();
            }, 100);

            // Device-specific optimizations
            if (Utils.isTouchDevice()) {
                $('body').addClass('touch-device');
                console.log('📱 Touch device detected');
            }

            if (Utils.isMobile()) {
                $('body').addClass('mobile-device');
                console.log('📱 Mobile viewport detected');
            }

            // Trigger custom ready event
            $(window).trigger('site.ready');

            const endTime = performance.now();
            console.log('✅ Enhanced Portfolio initialized successfully');
            console.log(`⚡ Initialization time: ${(endTime - startTime).toFixed(2)}ms`);
            console.log('📱 Viewport:', Utils.getViewportSize());
            console.log('🖥️ Device info:', {
                mobile: Utils.isMobile(),
                touch: Utils.isTouchDevice(),
                passive: Utils.supportsPassive()
            });

        } catch (error) {
            console.error('❌ Error during initialization:', error);
            // Fallback initialization for critical features
            ErrorHandling();
            MobileMenu();
        }
    });

    // ========================================
    // Preloader Enhanced
    // ========================================
    window.addEventListener("load", function() {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            // Delay mínimo para mejor UX
            setTimeout(() => {
                preloader.classList.add("hide-preloader");

                // Trigger animations después de que se oculte el preloader
                setTimeout(() => {
                    $(window).trigger('preloader.hidden');
                    $('body').addClass('loaded');

                    // Iniciar hero slider si no se había iniciado
                    if (typeof Swiper !== 'undefined' && $('.heroSwiper').length) {
                        setTimeout(HeroSlider, 100);
                    }
                }, 500);
            }, 800);
        }
    });

    // ========================================
    // Expose public API
    // ========================================
    window.RichardEscobarSite = {
        utils: Utils,
        version: '2.0.0',
        init: {
            mobileMenu: MobileMenu,
            heroSlider: HeroSlider,
            scrollAnimations: ScrollAnimations
        }
    };

})(window.jQuery);