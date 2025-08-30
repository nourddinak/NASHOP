document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.title-container h1 .animate-gradient-text');
    const teamTitle = document.getElementById('team-heading');
    const heroSection = document.getElementById('top');

    if (!heroTitle || !teamTitle || !heroSection) {
        console.error('Title transition elements not found.');
        return;
    }

    let animationInProgress = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Trigger when the hero section is 50% out of view from the top
            if (entry.boundingClientRect.bottom < window.innerHeight / 2 && !animationInProgress) {
                // Start the transition
                startTitleTransition();
            }
        });
    }, {
        threshold: 0.1 // A threshold of 0.1 means the callback will run when 10% of the element is visible
    });

    observer.observe(heroSection);

    function startTitleTransition() {
        animationInProgress = true;
        console.log("Starting title transition...");

        const heroRect = heroTitle.getBoundingClientRect();
        const teamRect = teamTitle.getBoundingClientRect();

        // 1. Create particles from the hero title
        const particles = createParticles(heroTitle, heroRect);

        // 2. Animate particles to the team title's position
        animateParticles(particles, teamRect);

        // 3. Fade out hero title and fade in team title
        heroTitle.style.opacity = '0';
        teamTitle.style.opacity = '0'; // Hide it initially, particles will form it

        setTimeout(() => {
            teamTitle.style.opacity = '1';
            animationInProgress = false; // Reset for potential future animations
        }, 2000); // Duration of the particle animation
    }

    function createParticles(element, rect) {
        const particles = [];
        const text = element.innerText;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = getComputedStyle(element).font;

        const textWidth = ctx.measureText(text).width;
        const particleCount = 1000; // More particles for a denser effect

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: rect.left + (Math.random() * rect.width),
                y: rect.top + (Math.random() * rect.height),
                size: Math.random() * 2 + 1,
                color: `rgba(132, 204, 22, ${Math.random()})`, // Neon lime with random opacity
            });
        }
        return particles;
    }

    function animateParticles(particles, targetRect) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '100';
        document.body.appendChild(container);

        particles.forEach(p => {
            const particleEl = document.createElement('div');
            particleEl.style.position = 'absolute';
            particleEl.style.left = `${p.x}px`;
            particleEl.style.top = `${p.y}px`;
            particleEl.style.width = `${p.size}px`;
            particleEl.style.height = `${p.size}px`;
            particleEl.style.backgroundColor = p.color;
            particleEl.style.borderRadius = '50%';
            container.appendChild(particleEl);

            const targetX = targetRect.left + (Math.random() * targetRect.width);
            const targetY = targetRect.top + (Math.random() * targetRect.height);

            particleEl.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${targetX - p.x}px, ${targetY - p.y}px) scale(0.5)`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });
        });

        setTimeout(() => {
            document.body.removeChild(container);
        }, 2000);
    }
});
