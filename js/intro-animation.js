document.addEventListener('DOMContentLoaded', () => {
    const curtain = document.getElementById('animation-curtain');
    const heroSection = document.getElementById('top');

    if (curtain && heroSection) {
        const elementsToAnimate = heroSection.querySelectorAll('[data-animate]');

        // Initially hide all elements
        elementsToAnimate.forEach(el => {
            el.classList.add('intro-hidden');
        });

        const timeline = [
            { selector: '.stars-container', delay: 100, animation: 'intro-fade-in' },
            { selector: '.shooting-star', delay: 300, animation: 'intro-fade-in' },
            { selector: '.logo-container', delay: 500, animation: 'intro-slide-up' },
            { selector: '.title-container h1 > div:first-child', delay: 800, animation: 'glitch' },
            { selector: '.title-container h1 > div:last-child', delay: 1200, animation: 'intro-slide-up' },
            { selector: '.description-container', delay: 1500, animation: 'intro-slide-up' },
            { selector: '.cta-container', delay: 1800, animation: 'intro-slide-up' },
            { selector: '.scroll-indicator', delay: 2100, animation: 'intro-fade-in' },
        ];

        timeline.forEach(item => {
            const el = heroSection.querySelector(item.selector);
            if (el) {
                setTimeout(() => {
                    el.classList.remove('intro-hidden');
                    el.classList.add(item.animation);
                }, item.delay);
            }
        });

        // Fade out the curtain after a delay
        setTimeout(() => {
            curtain.style.opacity = '0';
            // Remove the curtain from the DOM after the transition
            setTimeout(() => {
                curtain.remove();
            }, 500);
        }, 300); // Start fading out the curtain early
    }
});
