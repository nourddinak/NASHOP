document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('interactive-grid');
    const heroSection = document.getElementById('top');

    if (canvas && heroSection) {
        const ctx = canvas.getContext('2d');
        let dots = [];
        const dotSpacing = 30;
        const dotSize = 1;
        const rippleRadius = 150;
        const maxDotSize = 5;
        const rippleIntensity = 5;

        let mouse = {
            x: -9999,
            y: -9999
        };

        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            createDots();
        }

        function createDots() {
            dots = [];
            for (let x = dotSpacing / 2; x < canvas.width; x += dotSpacing) {
                for (let y = dotSpacing / 2; y < canvas.height; y += dotSpacing) {
                    dots.push({ x: x, y: y });
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            dots.forEach(dot => {
                const dx = dot.x - mouse.x;
                const dy = dot.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let size = dotSize;
                let opacity = 0.2;

                if (distance < rippleRadius) {
                    const rippleFactor = 1 - (distance / rippleRadius);
                    size = dotSize + (maxDotSize - dotSize) * rippleFactor * rippleIntensity;
                    opacity = 0.2 + 0.8 * rippleFactor;
                }

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(132, 204, 22, ${opacity})`; // Neon Lime with variable opacity
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroSection.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        window.addEventListener('resize', resizeCanvas);

        resizeCanvas();
        animate();
    }
});
