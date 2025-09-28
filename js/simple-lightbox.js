/*!
 * Simple Lightbox for Richard Scobar Portfolio
 * Ultra minimalist lightbox without external dependencies
 */

(function() {
    'use strict';

    let currentImageIndex = 0;
    let images = [];
    let lightboxContainer = null;

    // Initialize lightbox
    function initLightbox() {
        // Create lightbox HTML
        const lightboxHTML = `
            <div id="simple-lightbox" class="lightbox-overlay">
                <div class="lightbox-content">
                    <img id="lightbox-image" src="" alt="">
                    <div class="lightbox-controls">
                        <button class="lightbox-btn lightbox-close" aria-label="Cerrar">&times;</button>
                        <button class="lightbox-btn lightbox-prev" aria-label="Anterior">&lsaquo;</button>
                        <button class="lightbox-btn lightbox-next" aria-label="Siguiente">&rsaquo;</button>
                    </div>
                    <div class="lightbox-counter">
                        <span id="lightbox-current">1</span> / <span id="lightbox-total">1</span>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        lightboxContainer = document.getElementById('simple-lightbox');

        // Add CSS
        addLightboxCSS();

        // Add event listeners
        addEventListeners();
    }

    // Add CSS styles
    function addLightboxCSS() {
        const css = `
            .lightbox-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .lightbox-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .lightbox-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            }

            .lightbox-overlay img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 4px;
            }

            .lightbox-controls {
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
            }

            .lightbox-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .lightbox-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 60px;
                height: 60px;
                font-size: 24px;
            }

            .lightbox-prev {
                left: 30px;
            }

            .lightbox-next {
                right: 30px;
            }

            .lightbox-counter {
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
                background: rgba(0, 0, 0, 0.3);
                padding: 8px 16px;
                border-radius: 16px;
                backdrop-filter: blur(10px);
            }

            @media (max-width: 768px) {
                .lightbox-controls {
                    top: 15px;
                    right: 15px;
                }

                .lightbox-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                }

                .lightbox-prev,
                .lightbox-next {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }

                .lightbox-prev {
                    left: 15px;
                }

                .lightbox-next {
                    right: 15px;
                }

                .lightbox-counter {
                    bottom: 15px;
                    font-size: 12px;
                    padding: 6px 12px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = css;
        document.head.appendChild(styleSheet);
    }

    // Add event listeners
    function addEventListeners() {
        const closeBtn = lightboxContainer.querySelector('.lightbox-close');
        const prevBtn = lightboxContainer.querySelector('.lightbox-prev');
        const nextBtn = lightboxContainer.querySelector('.lightbox-next');
        const overlay = lightboxContainer;

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightboxContainer.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });
    }

    // Open lightbox
    function openLightbox(imageSrc, imageIndex) {
        currentImageIndex = imageIndex;

        const lightboxImage = document.getElementById('lightbox-image');
        lightboxImage.src = imageSrc;

        updateCounter();
        lightboxContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightboxContainer.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Show previous image
    function showPrevImage() {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        showCurrentImage();
    }

    // Show next image
    function showNextImage() {
        currentImageIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        showCurrentImage();
    }

    // Show current image
    function showCurrentImage() {
        const lightboxImage = document.getElementById('lightbox-image');
        lightboxImage.src = images[currentImageIndex].href;
        updateCounter();
    }

    // Update counter
    function updateCounter() {
        document.getElementById('lightbox-current').textContent = currentImageIndex + 1;
        document.getElementById('lightbox-total').textContent = images.length;
    }

    // Collect gallery images
    function collectImages() {
        images = Array.from(document.querySelectorAll('.gallery-link')).map(link => ({
            href: link.href,
            alt: link.querySelector('img').alt
        }));
    }

    // Initialize when DOM is ready
    function init() {
        initLightbox();
        collectImages();

        // Add click listeners to gallery links
        document.querySelectorAll('.gallery-link').forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(link.href, index);
            });
        });
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.SimpleLightbox = {
        open: openLightbox,
        close: closeLightbox,
        init: init
    };

})();