document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('interactive-grid');
    const heroSection = document.getElementById('top');

    if (canvas && heroSection) {
        const ctx = canvas.getContext('2d');
        let dots = [];
        const dotSpacing = 35; // Increased spacing for a cleaner look
        const dotSize = 1.5; // Slightly larger base size
        const rippleRadius = 250; // Larger area of effect
        const maxDisplacement = 20; // How far dots can move
        const warpIntensity = 1.5; // Multiplier for the warp effect strength

        let mouse = {
            x: -9999,
            y: -9999,
            prevX: -9999,
            prevY: -9999
        };

        let animationFrameId;

        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            createDots();
        }

        function createDots() {
            dots = [];
            for (let x = dotSpacing / 2; x < canvas.width; x += dotSpacing) {
                for (let y = dotSpacing / 2; y < canvas.height; y += dotSpacing) {
                    dots.push({
                        x: x,
                        y: y,
                        originalX: x,
                        originalY: y,
                        velocityX: 0,
                        velocityY: 0
                    });
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseSpeed = Math.sqrt(Math.pow(mouse.x - mouse.prevX, 2) + Math.pow(mouse.y - mouse.prevY, 2));

            dots.forEach(dot => {
                const dx = dot.originalX - mouse.x;
                const dy = dot.originalY - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let targetX = dot.originalX;
                let targetY = dot.originalY;
                let opacity = 0.15;
                let lineColor = `rgba(132, 204, 22, ${opacity})`;

                if (distance < rippleRadius) {
                    const rippleFactor = 1 - (distance / rippleRadius);
                    const angle = Math.atan2(dy, dx);

                    // Calculate displacement based on ripple factor and warp intensity
                    const displacement = Math.pow(rippleFactor, 2) * maxDisplacement * warpIntensity;

                    targetX = dot.originalX + Math.cos(angle) * displacement;
                    targetY = dot.originalY + Math.sin(angle) * displacement;

                    opacity = 0.15 + 0.8 * rippleFactor;
                    lineColor = `rgba(125, 211, 252, ${opacity * 0.7})`; // Use a different color for the trails (sky blue)

                    // Draw a "warp" trail from the original position
                    ctx.beginPath();
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(targetX, targetY);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = dotSize;
                    ctx.stroke();
                }

                // Spring physics for smooth movement
                const ax = (targetX - dot.x) * 0.1;
                const ay = (targetY - dot.y) * 0.1;

                dot.velocityX += ax;
                dot.velocityY += ay;

                dot.velocityX *= 0.9; // Damping
                dot.velocityY *= 0.9; // Damping

                dot.x += dot.velocityX;
                dot.y += dot.velocityY;

                // Draw the dot itself
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(132, 204, 22, ${opacity})`; // Neon Lime for the dot
                ctx.fill();
            });

            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;

            animationFrameId = requestAnimationFrame(animate);
        }

        function stopAnimation() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }

        function startAnimation() {
            if (!animationFrameId) {
                animate();
            }
        }

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            startAnimation();
        });

        heroSection.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });

        window.addEventListener('resize', () => {
            stopAnimation();
            resizeCanvas();
            startAnimation();
        });

        resizeCanvas();
        startAnimation();
    }
});
