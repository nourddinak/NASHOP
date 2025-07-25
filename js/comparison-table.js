// comparison-table.js - Collapsible Comparison Table Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle elements
    const toggles = document.querySelectorAll('.comparison-feature-toggle');

    // Add click event listener to each toggle
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Skip on desktop (lg screens)
            if (window.innerWidth >= 1024) {
                return;
            }

            // Get the target content ID from data attribute
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const chevron = this.querySelector('.fa-chevron-down');

            // Toggle the content visibility
            if (targetContent) {
                // Toggle the hidden class
                targetContent.classList.toggle('hidden');

                // Rotate the chevron icon when expanded
                if (chevron) {
                    if (targetContent.classList.contains('hidden')) {
                        chevron.style.transform = 'rotate(0deg)';
                    } else {
                        chevron.style.transform = 'rotate(180deg)';
                    }
                }
            }
        });
    });

    // Show the first item by default on mobile
    const firstToggle = document.querySelector('.comparison-feature-toggle');
    if (firstToggle && window.innerWidth < 1024) {
        firstToggle.click();
    }

    // Handle window resize events
    window.addEventListener('resize', function() {
        // If resizing from mobile to desktop, make sure desktop view is correct
        if (window.innerWidth >= 1024) {
            // Reset all chevrons to default position
            document.querySelectorAll('.fa-chevron-down').forEach(chevron => {
                chevron.style.transform = 'rotate(0deg)';
            });
        }
    });
});
