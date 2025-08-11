document.addEventListener('DOMContentLoaded', () => {
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    const modal = document.getElementById('roadmap-modal');
    const closeModalBtn = document.getElementById('close-roadmap-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (roadmapItems.length > 0 && modal && closeModalBtn && modalTitle && modalBody) {
        const roadmapData = [
            {
                title: 'Phase 1: Foundation & Architecture',
                status: 'Completed',
                timeline: '2023-2025',
                goals: [
                    'Core platform architecture design.',
                    'Development of the DAN token smart contract.',
                    'Rigorous security audits and penetration testing.',
                    'Establishment of foundational partnerships.'
                ]
            },
            {
                title: 'Phase 2: DAN Token Presale',
                status: 'In Progress',
                timeline: 'Q1 2026',
                goals: [
                    'Launch of the official $DAN mainnet token presale.',
                    'Community building and marketing campaigns.',
                    'Early access investment opportunities for supporters.'
                ]
            },
            {
                title: 'Phase 3: Platform Beta Access',
                status: 'Planned',
                timeline: 'Q2 2026',
                goals: [
                    'Invite-only beta program for the Nashop platform.',
                    'Gathering user feedback for iterative improvements.',
                    'Testing core functionality and reward systems.'
                ]
            },
            {
                title: 'Phase 4: Global Mainnet Launch',
                status: 'Planned',
                timeline: 'Q4 2026',
                goals: [
                    'Full public release of the Nashop.store platform.',
                    'Activation of the $DAN token economy globally.',
                    'Decentralized governance via the Nashop DAO.'
                ]
            }
        ];

        function openModal(index) {
            const data = roadmapData[index];
            if (data) {
                modalTitle.textContent = data.title;
                let bodyHtml = `<p class="mb-4"><strong>Status:</strong> <span class="text-lime-400">${data.status}</span> | <strong>Timeline:</strong> ${data.timeline}</p>`;
                bodyHtml += '<ul class="list-disc list-inside space-y-2">';
                data.goals.forEach(goal => {
                    bodyHtml += `<li>${goal}</li>`;
                });
                bodyHtml += '</ul>';
                modalBody.innerHTML = bodyHtml;

                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeModal() {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        roadmapItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openModal(index);
            });
        });

        closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }
});
