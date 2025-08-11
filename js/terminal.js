document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const terminalContent = document.getElementById('terminal-content');

    if (terminal && closeTerminalBtn && terminalContent) {
        const lines = [
            "> Connecting to NASHOP servers...",
            "> Connection established.",
            "> Bypassing security protocols...",
            "> Access granted.",
            "> Welcome.",
            "> ",
            "> System Status: All systems nominal.",
            "> "
        ];

        function typeWriter(text, i, p) {
            if (i < text.length) {
                p.innerHTML += text.charAt(i);
                i++;
                setTimeout(() => typeWriter(text, i, p), 50);
            }
        }

        function showTerminal() {
            terminal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            // Clear previous content
            terminalContent.innerHTML = '';

            // Type out lines
            lines.forEach((line, index) => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    p.innerHTML = '&gt; ';
                    terminalContent.appendChild(p);
                    typeWriter(line.substring(2), 0, p);
                }, index * 600);
            });
        }

        function hideTerminal() {
            terminal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === '`' || e.key === '~') {
                if (terminal.classList.contains('hidden')) {
                    showTerminal();
                } else {
                    hideTerminal();
                }
            }
        });

        closeTerminalBtn.addEventListener('click', hideTerminal);
    }
});
