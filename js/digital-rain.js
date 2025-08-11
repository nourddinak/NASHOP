document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('digital-rain');
    const heroSection = document.getElementById('top');

    if (canvas && heroSection) {
        const ctx = canvas.getContext('2d');

        let width, height, columns;
        let drops = [];

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const characters = katakana + latin + nums;
        const fontSize = 16;

        function initialize() {
            width = heroSection.offsetWidth;
            height = heroSection.offsetHeight;
            canvas.width = width;
            canvas.height = height;

            columns = Math.floor(width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#34D399'; // Emerald-400, a nice green for the rain
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        let animationFrameId;
        function animate() {
            draw();
            animationFrameId = requestAnimationFrame(animate);
        }

        function handleResize() {
            cancelAnimationFrame(animationFrameId);
            initialize();
            animate();
        }

        window.addEventListener('resize', handleResize);

        // Initial setup
        initialize();
        animate();
    }
});
