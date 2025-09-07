// script.js

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('🚀 Nashop website loaded successfully!');
    console.log('⚡ Modern animation system active');
    console.log('🎯 Performance optimizations enabled');
    console.log('✅ All functionality preserved');

    // --- Initialize Lucide Icons ---
    if (typeof lucide !== 'undefined') {
        try {
            lucide.createIcons();
        } catch (e) {
            console.error("Lucide icon creation failed:", e);
        }
    } else {
        console.warn("Lucide library not loaded. Icons may not appear.");
    }

    // --- Footer Current Year ---
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Partner Logo Population ---
    const partnerLogos = [
        'FROGPAY.png',
        'BNINER.jpg',
        'reelai.png',
        // Add more logo filenames here
    ];
    const logoSet1Container = document.getElementById('partner-logos-set1');
    const logoSet2Container = document.getElementById('partner-logos-set2');
    const logoBasePath = 'img/partners/'; // IMPORTANT: Ensure this path is correct

    if (logoSet1Container && logoSet2Container) {
         if (partnerLogos.length === 0) {
              // Optionally hide the section
              const partnersSection = document.getElementById('partners');
              if(partnersSection) partnersSection.style.display = 'none';
              console.warn("Partner logo array is empty. Hiding section.");
         } else {
             partnerLogos.forEach(filename => {
                 const brandLogoDiv = document.createElement('div');
                 brandLogoDiv.className = 'brandLogo';
                 brandLogoDiv.setAttribute('role', 'listitem');

                 const img = document.createElement('img');
                 img.src = logoBasePath + filename;
                 img.loading = 'lazy';

                 let altText = filename.substring(0, filename.lastIndexOf('.')) || filename;
                 altText = altText.replace(/[-_]/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                 img.alt = `Nashop Partner: ${altText}`;

                 brandLogoDiv.appendChild(img);
                 logoSet1Container.appendChild(brandLogoDiv.cloneNode(true));
                 logoSet2Container.appendChild(brandLogoDiv.cloneNode(true));
             });

            // Dynamically calculate track width after logos are added
            const firstSetWidth = logoSet1Container.offsetWidth;
            const trackElement = document.getElementById('partner-marquee');
            if (trackElement && firstSetWidth > 0) {
                 // Set total track width (set1 width + set2 width)
                 const totalWidth = firstSetWidth * 2;
                 trackElement.style.width = `${totalWidth}px`;

                 // Adjust animation duration based on width for consistent speed
                 const baseDuration = 45; // Duration for a baseline width (e.g., 1920px)
                 const baselineWidth = 1920;
                 const newDuration = (totalWidth / baselineWidth) * baseDuration;
                 // Apply new duration - target the track itself
                 trackElement.style.animationDuration = `${Math.max(20, newDuration)}s`; // Ensure minimum duration
                 // Reassign animation to apply duration - find the parent? No, need to target the animated element itself
                 trackElement.classList.remove('animate-marquee');
                 void trackElement.offsetWidth; // Trigger reflow
                 trackElement.classList.add('animate-marquee');
            } else if (firstSetWidth === 0) {
                console.warn("Could not calculate partner logo width for marquee animation timing.");
            }
         }
    } else {
        console.error("Partner logo container elements ('partner-logos-set1' or 'partner-logos-set2') not found.");
    }

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .feature-card'); // Add feature-card to the query
    if ('IntersectionObserver' in window) {
         const observer = new IntersectionObserver((entries, observerInstance) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     entry.target.classList.add('is-visible'); // Trigger animation
                     observerInstance.unobserve(entry.target); // Stop observing once animated
                 }
             });
         }, {
             threshold: 0.1 // Trigger when 10% of the element enters the viewport
         });

         animatedElements.forEach(el => {
            // Observe all animated elements
            observer.observe(el);
         });
     } else {
         // Fallback for browsers that don't support IntersectionObserver
         console.warn("IntersectionObserver not supported. Animations will show immediately.");
         animatedElements.forEach(el => el.classList.add('is-visible'));
     }

     // --- 3D Card Tilt Effect ---
     const tiltContainers = document.querySelectorAll('.perspective-container');
     tiltContainers.forEach(container => {
         const card = container.querySelector('.card-3d-effect');
         if (card) {
             container.addEventListener('mousemove', (e) => {
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  const rotateY = (x / (rect.width / 2)) * 7;
                  const rotateX = -(y / (rect.height / 2)) * 5;

                  requestAnimationFrame(() => {
                     card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px) scale(1.02)`;
                  });
             });

             container.addEventListener('mouseleave', () => {
                 requestAnimationFrame(() => {
                     card.style.transform = '';
                 });
             });
         } else {
            console.warn("No element with class 'card-3d-effect' found inside a 'perspective-container'.");
         }
    });

    // --- Enhanced Home Section 3D Effects ---
    // Logo 3D effect
    const logo3dContainer = document.querySelector('.logo-3d-container');
    if (logo3dContainer) {
        const logoParent = logo3dContainer.parentElement;

        logoParent.addEventListener('mousemove', (e) => {
            const rect = logoParent.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Calculate rotation based on mouse position relative to center
            const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 12;
            const rotateX = -((mouseY - centerY) / (rect.height / 2)) * 8;

            // Apply transform with smooth transition
            requestAnimationFrame(() => {
                logo3dContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });

        logoParent.addEventListener('mouseleave', () => {
            // Reset transform with smooth transition back to default
            requestAnimationFrame(() => {
                logo3dContainer.style.transform = '';
            });
        });

        // --- Fingerprint Click Effect ---
        const fingerprintClickable = document.querySelector('.fingerprint-clickable');
        const fingerprintParticles = document.querySelector('.fingerprint-particles');
        const fingerprintRippleContainer = document.querySelector('.fingerprint-ripple-container');
        const fingerprintEnergyBurst = document.querySelector('.fingerprint-energy-burst');

        if (fingerprintClickable && fingerprintParticles && fingerprintRippleContainer && fingerprintEnergyBurst) {
            // Track click count for different effects
            let clickCount = 0;

            // Function to create ripple effect
            function createRippleEffect() {
                // Create multiple ripples with different sizes and delays
                for (let i = 0; i < 3; i++) {
                    const ripple = document.createElement('div');
                    ripple.classList.add('fingerprint-ripple', 'animate-ripple');

                    // Set size based on index
                    const size = 100 + (i * 40); // 100px, 140px, 180px
                    ripple.style.width = `${size}px`;
                    ripple.style.height = `${size}px`;

                    // Set delay based on index
                    ripple.style.animationDelay = `${i * 0.2}s`;

                    // Add to container
                    fingerprintRippleContainer.appendChild(ripple);

                    // Remove after animation completes
                    setTimeout(() => {
                        ripple.remove();
                    }, 1500 + (i * 200)); // Match animation duration plus delay
                }
            }

            // Function to create particle explosion
            function createParticleExplosion() {
                // Number of particles based on click count (more particles for more clicks)
                const particleCount = 20 + (clickCount * 5);
                const colors = ['#a855f7', '#d946ef', '#38bdf8', '#8b5cf6', '#22d3ee'];

                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('fingerprint-particle');

                    // Random size between 3px and 8px
                    const size = 3 + Math.random() * 5;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;

                    // Random color from array
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.backgroundColor = color;
                    particle.style.boxShadow = `0 0 ${size}px ${color}`;

                    // Random direction
                    const angle = Math.random() * Math.PI * 2; // Random angle in radians
                    const distance = 50 + Math.random() * 100; // Random distance between 50px and 150px
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;

                    // Set CSS variables for the animation
                    particle.style.setProperty('--tx', `${tx}px`);
                    particle.style.setProperty('--ty', `${ty}px`);

                    // Add animation
                    particle.style.animation = `particle-float ${0.5 + Math.random() * 1}s cubic-bezier(0.22, 0.61, 0.36, 1) forwards`;

                    // Add to container
                    fingerprintParticles.appendChild(particle);

                    // Remove after animation completes
                    setTimeout(() => {
                        particle.remove();
                    }, 2000); // Ensure this is longer than the longest animation
                }
            }

            // Function to create energy burst effect
            function createEnergyBurst() {
                // Make energy burst visible
                fingerprintEnergyBurst.style.opacity = '0.8';
                fingerprintEnergyBurst.style.transform = 'scale(0.8)';
                fingerprintEnergyBurst.classList.add('animate-energy-burst');

                // Remove animation class after it completes
                setTimeout(() => {
                    fingerprintEnergyBurst.classList.remove('animate-energy-burst');
                    fingerprintEnergyBurst.style.opacity = '0';
                    fingerprintEnergyBurst.style.transform = 'scale(0)';
                }, 1500);
            }

            // Function to create 3D floating symbols
            function createFloatingSymbols() {
                const symbols = ['$', 'D', 'A', 'N', '💎', '🔐', '⚡'];
                const container = document.querySelector('.logo-container');

                if (container) {
                    for (let i = 0; i < 10; i++) {
                        const symbol = document.createElement('div');
                        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

                        symbol.textContent = randomSymbol;
                        symbol.classList.add('absolute', 'text-xl', 'font-bold', 'text-white', 'animate-rotate-3d', 'pointer-events-none');
                        symbol.style.textShadow = '0 0 10px rgba(217, 70, 239, 0.8)';

                        // Random position around the fingerprint
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 60 + Math.random() * 80;
                        const top = 50 + Math.sin(angle) * distance;
                        const left = 50 + Math.cos(angle) * distance;

                        symbol.style.top = `${top}%`;
                        symbol.style.left = `${left}%`;

                        // Random animation duration and delay
                        symbol.style.animationDuration = `${2 + Math.random() * 3}s`;
                        symbol.style.animationDelay = `${Math.random() * 0.5}s`;

                        // Add to container
                        container.appendChild(symbol);

                        // Remove after animation
                        setTimeout(() => {
                            symbol.style.opacity = '0';
                            setTimeout(() => symbol.remove(), 500);
                        }, 3000 + Math.random() * 1000);
                    }
                }
            }

            // Click event handler for fingerprint
            fingerprintClickable.addEventListener('click', () => {
                // Increment click count
                clickCount = (clickCount + 1) % 5; // Reset after 5 clicks

                // Create ripple effect
                createRippleEffect();

                // Create particle explosion
                createParticleExplosion();

                // Create energy burst
                createEnergyBurst();

                // On every third click, create floating symbols
                if (clickCount % 3 === 0) {
                    createFloatingSymbols();
                }

                // Add accessibility announcement for screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.classList.add('sr-only'); // Screen reader only
                announcement.textContent = 'Activated fingerprint effect!';
                document.body.appendChild(announcement);

                // Remove announcement after it's read
                setTimeout(() => {
                    announcement.remove();
                }, 1000);
            });

            // Keyboard event for accessibility
            fingerprintClickable.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fingerprintClickable.click();
                }
            });
        }
    }

    // Title 3D effect
    const title3dContainer = document.querySelector('.title-3d-container');
    if (title3dContainer) {
        document.addEventListener('mousemove', (e) => {
            // Only apply effect on larger screens
            if (window.innerWidth >= 768) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // Calculate subtle rotation based on mouse position
                const rotateY = ((mouseX - (windowWidth / 2)) / (windowWidth / 2)) * 2;
                const rotateX = -((mouseY - (windowHeight / 2)) / (windowHeight / 2)) * 1;

                // Apply transform with smooth transition
                requestAnimationFrame(() => {
                    title3dContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
                });
            }
        });
    }

    // Parallax effect for cosmic dust
    const cosmicDustElements = document.querySelectorAll('.cosmic-dust');
    if (cosmicDustElements.length > 0) {
        document.addEventListener('mousemove', (e) => {
            // Only apply effect on larger screens
            if (window.innerWidth >= 768) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                cosmicDustElements.forEach((element, index) => {
                    // Calculate movement based on mouse position with different factors for each element
                    const moveX = ((mouseX - (windowWidth / 2)) / (windowWidth / 2)) * (10 + index * 5);
                    const moveY = ((mouseY - (windowHeight / 2)) / (windowHeight / 2)) * (10 + index * 5);

                    // Apply transform with smooth transition
                    requestAnimationFrame(() => {
                        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    });
                });
            }
        });
    }

    // --- Newsletter Form Submission ---
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", subscribeNewsletter);
    } else {
        console.warn("Newsletter form with ID 'newsletter-form' not found.");
    }

    // --- Scroll Navigation Logic ---
    setupScrollNavigation();

    // --- QR Video Scroll Functionality ---
    setupQRVideoScrollTrigger();

    // --- Whitelist Video Modal Functionality ---
    setupWhitelistVideoModal();

    // --- Performance Mode Toggle ---
    setupPerformanceModeToggle();

    // --- Modern Animation System ---
    setupModernAnimations();

    // Testimonials section has been removed

    // --- Mobile App Store Buttons Coming Soon Notification ---
    const storeButtons = document.querySelectorAll('.store-button-trigger');
    const comingSoonNotification = document.getElementById('coming-soon-notification');
    const closeNotificationBtn = document.getElementById('close-notification');
    const storeNameElement = document.getElementById('store-name');
    const joinWaitlistBtn = document.getElementById('join-waitlist-btn');

    if (storeButtons.length && comingSoonNotification && closeNotificationBtn && storeNameElement) {
        // Function to show notification
        function showComingSoonNotification(storeName) {
            // Update store name in the message
            storeNameElement.textContent = storeName;

            // Show notification with animation
            comingSoonNotification.classList.remove('opacity-0', 'pointer-events-none');
            comingSoonNotification.classList.add('opacity-100', 'pointer-events-auto');

            // Animate the content
            const notificationContent = comingSoonNotification.querySelector('.notification-content');
            if (notificationContent) {
                setTimeout(() => {
                    notificationContent.classList.remove('scale-95');
                    notificationContent.classList.add('scale-100');
                }, 10);
            }

            // Add body class to prevent scrolling
            document.body.classList.add('overflow-hidden');
        }

        // Function to hide notification
        function hideComingSoonNotification() {
            // Hide notification with animation
            const notificationContent = comingSoonNotification.querySelector('.notification-content');
            if (notificationContent) {
                notificationContent.classList.remove('scale-100');
                notificationContent.classList.add('scale-95');
            }

            // Delay the opacity transition slightly for better animation
            setTimeout(() => {
                comingSoonNotification.classList.remove('opacity-100', 'pointer-events-auto');
                comingSoonNotification.classList.add('opacity-0', 'pointer-events-none');
            }, 200);

            // Remove body class to allow scrolling again
            document.body.classList.remove('overflow-hidden');
        }

        // Add click event listeners to store buttons
        storeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const storeName = button.getAttribute('data-store') || 'app stores';
                showComingSoonNotification(storeName);
            });
        });

        // Add click event listener to close button
        closeNotificationBtn.addEventListener('click', hideComingSoonNotification);

        // Close notification when clicking outside the content
        comingSoonNotification.addEventListener('click', (e) => {
            if (e.target === comingSoonNotification) {
                hideComingSoonNotification();
            }
        });

        // Add click event listener to join waitlist button
        if (joinWaitlistBtn) {
            joinWaitlistBtn.addEventListener('click', () => {
                // Scroll to the QR code section when clicked
                const qrCodeSection = document.querySelector('.qr-code-container');
                if (qrCodeSection) {
                    hideComingSoonNotification();
                    setTimeout(() => {
                        qrCodeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Add a highlight effect to the QR code
                        qrCodeSection.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-70');
                        setTimeout(() => {
                            qrCodeSection.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-70');
                        }, 2000);
                    }, 300);
                }
            });
        }

        // Add keyboard event listener to close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !comingSoonNotification.classList.contains('opacity-0')) {
                hideComingSoonNotification();
            }
        });
    }
}); // --- End DOMContentLoaded ---


// --- Newsletter Subscription Function ---
async function subscribeNewsletter(event) {
     event.preventDefault(); // Prevent default form submission behavior

     const emailInput = document.getElementById("email");
     const message = document.getElementById("subscription-message");
     const subscribeButton = document.getElementById("subscribe-button");

     if (!emailInput || !message || !subscribeButton) {
        console.error("Newsletter form elements (email, message, button) not found.");
        return;
     }

     const email = emailInput.value.trim();

     // Basic client-side validation
     if (!email || !emailInput.checkValidity()) {
         message.textContent = "Please enter a valid email address.";
         message.classList.remove("hidden", "text-green-400");
         message.classList.add("text-red-500"); // Use red for error messages
         emailInput.focus();
         return;
     }

     // Update UI during submission
     subscribeButton.textContent = "Subscribing...";
     subscribeButton.disabled = true;
     message.classList.add("hidden"); // Hide previous messages
     message.classList.remove("text-red-500", "text-green-400"); // Reset message color

     // Your Google Apps Script URL
     const scriptURL = "https://script.google.com/macros/s/AKfycbzBVe_hIaecNcXRLm-NQB33pUzSYNhoF2D7fFg6JTgy2vYWiW56QbIJXy_AZ61GKOJ8/exec";
     const formData = new FormData();
     formData.append("email", email);

     try {
         const response = await fetch(scriptURL, { method: "POST", body: formData });

         // Check for successful submission (Google Apps Script often returns redirects/opaque responses)
         if (response.ok || response.type === 'opaque' || response.status === 200 || response.status === 302) {
             message.textContent = "✅ Success! Thanks for subscribing.";
             message.classList.remove("hidden");
             message.classList.add("text-green-400"); // Green for success
             emailInput.value = ""; // Clear the input field
             // Hide the success message after a few seconds
             setTimeout(() => message.classList.add('hidden'), 5000);
         } else {
              // Handle non-successful responses
              throw new Error(`Subscription failed with status: ${response.status}`);
         }
     } catch (error) {
         console.error("Error submitting newsletter form:", error);
         message.textContent = "❌ Error! Subscription failed. Please try again later.";
         message.classList.remove("hidden");
         message.classList.add("text-red-500"); // Red for error
     } finally {
          // Always re-enable the button and reset its text
          subscribeButton.textContent = "Subscribe";
          subscribeButton.disabled = false;
      }
 }

// --- Scroll Navigation Setup Function ---
function setupScrollNavigation() {
    const scrollNav = document.getElementById('scroll-nav');
    if (!scrollNav) {
        console.warn("Scroll navigation element (#scroll-nav) not found.");
        return;
    }

    const nodes = scrollNav.querySelectorAll('.scroll-nav-node');
    const revealBar = scrollNav.querySelector('.scroll-nav-red-container');
    const logoLink = scrollNav.querySelector('.scroll-nav-logo-link');
    const blueLine = scrollNav.querySelector('.scroll-nav-blue-line');
    const currentSectionDisplay = document.getElementById('scroll-nav-section-name');

    if (!nodes.length || !revealBar || !logoLink || !blueLine) {
        console.error("Required elements for scroll navigation missing (nodes, revealBar, logoLink, blueLine).");
        return;
    }

    // --- Get Target Sections and Positions ---
    const targetSections = [];
    const targetPositions = [];
    const sectionLabels = [];
    const sectionScrollPadding = 100;

    // Get node targets and their labels
    const nodeTargets = Array.from(nodes).map(node => {
        sectionLabels.push(node.dataset.label || 'Section');
        return node.dataset.target;
    });

    nodeTargets.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            targetSections.push(section);
            targetPositions.push(section.getBoundingClientRect().top + window.scrollY);
        } else {
            console.warn(`Scroll nav target section "${selector}" not found.`);
        }
    });

    if (!targetPositions.length) {
        console.error("No valid target sections found for scroll navigation.");
        scrollNav.style.display = 'none';
        return;
    }

    // --- Calculate Node Spacing ---
    const firstNodeOffsetLeft = nodes[0].offsetLeft;
    const nodePositionsX = Array.from(nodes).map(node =>
        node.offsetLeft - firstNodeOffsetLeft + (node.offsetWidth / 2)
    );

    // --- Add particle animation ---
    function animateParticles() {
        const particles = scrollNav.querySelectorAll('.scroll-nav-particles span');
        particles.forEach(particle => {
            // Randomize initial positions slightly
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
    }

    // Run particle animation
    animateParticles();

    // --- Scroll Event Handler ---
    let lastScrollTop = 0;
    let scrollDirection = 'down';

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        // Determine scroll direction
        scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop;

        // Adjust activation point based on scroll direction
        const activationPoint = scrollTop + windowHeight * (scrollDirection === 'down' ? 0.6 : 0.4);

        let currentTargetIndex = -1;

        // Determine which section is currently active
        for (let i = targetPositions.length - 1; i >= 0; i--) {
            if (activationPoint >= targetPositions[i] - sectionScrollPadding) {
                currentTargetIndex = i;
                break;
            }
        }

        // Update node active states with enhanced effects
        nodes.forEach((node, index) => {
            const isActive = index === currentTargetIndex;
            const wasActive = node.classList.contains('active');

            if (isActive && !wasActive) {
                // Activate this node with effects
                node.classList.add('active');
                node.classList.add('activating');

                // Update current section display with animation only on mobile
                if (currentSectionDisplay && window.innerWidth < 1024) {
                    // Fade out
                    currentSectionDisplay.style.opacity = '0';
                    currentSectionDisplay.style.transform = 'translateY(5px)';

                    // After a short delay, update text and fade in
                    setTimeout(() => {
                        currentSectionDisplay.textContent = sectionLabels[index] || 'Section';
                        currentSectionDisplay.style.opacity = '1';
                        currentSectionDisplay.style.transform = 'translateY(0)';
                    }, 200);
                }

                // Enhance glow effects when section changes
                const glows = scrollNav.querySelectorAll('.scroll-nav-glow');
                glows.forEach(glow => {
                    glow.style.opacity = '0.3';
                    setTimeout(() => {
                        glow.style.opacity = '0.15';
                    }, 800);
                });

                // Remove activating class after transition
                setTimeout(() => node.classList.remove('activating'), 10);
            } else if (!isActive && wasActive) {
                node.classList.remove('active');
            }
        });

        // Check if we're in desktop mode (vertical nav)
        const isDesktopMode = window.innerWidth >= 1024;

        // Update progress bar (width for horizontal, height for vertical)
        if (isDesktopMode) {
            // Vertical progress bar for desktop
            let barHeight = 0;
            if (currentTargetIndex === -1) {
                barHeight = 0;
            } else {
                // Get node positions vertically
                const nodePositionsY = Array.from(nodes).map(node =>
                    node.offsetTop + (node.offsetHeight / 2) - nodes[0].offsetTop
                );

                const currentNodePosY = nodePositionsY[currentTargetIndex];

                if (currentTargetIndex === targetPositions.length - 1) {
                    // Last section is active, fill bar to the last node
                    barHeight = currentNodePosY;
                } else {
                    // Calculate progress with improved easing
                    const sectionStart = targetPositions[currentTargetIndex] - sectionScrollPadding;
                    const nextSectionStart = targetPositions[currentTargetIndex + 1] - sectionScrollPadding;
                    const sectionTravel = nextSectionStart - sectionStart;
                    const scrollInSection = Math.max(0, activationPoint - sectionStart);

                    // Use cubic easing for smoother progress
                    let progress = Math.min(1, scrollInSection / sectionTravel);
                    progress = easeInOutCubic(progress);

                    const nextNodePosY = nodePositionsY[currentTargetIndex + 1];
                    const segmentHeight = nextNodePosY - currentNodePosY;
                    barHeight = currentNodePosY + (segmentHeight * progress);
                }
            }

            // Apply progress bar height with limits
            const blueLineHeight = blueLine.offsetHeight;
            revealBar.style.height = `${Math.min(barHeight, blueLineHeight)}px`;
            revealBar.style.width = '2px'; // Ensure width is set for vertical mode
        } else {
            // Horizontal progress bar for mobile
            let barWidth = 0;
            if (currentTargetIndex === -1) {
                barWidth = 0;
            } else {
                const currentNodePosX = nodePositionsX[currentTargetIndex];

                if (currentTargetIndex === targetPositions.length - 1) {
                    barWidth = currentNodePosX;
                } else {
                    // Calculate progress with improved easing
                    const sectionStart = targetPositions[currentTargetIndex] - sectionScrollPadding;
                    const nextSectionStart = targetPositions[currentTargetIndex + 1] - sectionScrollPadding;
                    const sectionTravel = nextSectionStart - sectionStart;
                    const scrollInSection = Math.max(0, activationPoint - sectionStart);

                    // Use cubic easing for smoother progress
                    let progress = Math.min(1, scrollInSection / sectionTravel);
                    progress = easeInOutCubic(progress);

                    const nextNodePosX = nodePositionsX[currentTargetIndex + 1];
                    const segmentWidth = nextNodePosX - currentNodePosX;
                    barWidth = currentNodePosX + (segmentWidth * progress);
                }
            }

            // Apply progress bar width with limits
            const blueLineWidth = blueLine.offsetWidth;
            revealBar.style.width = `${Math.min(barWidth, blueLineWidth)}px`;
            revealBar.style.height = '2px'; // Ensure height is set for horizontal mode
        }
    };

    // Easing function for smoother animations
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // --- Enhanced Click Event Handlers ---
    nodes.forEach((node, index) => {
        node.addEventListener('click', () => {
            if (index < targetPositions.length) {
                // Add click effect
                node.classList.add('activating');
                setTimeout(() => node.classList.remove('activating'), 300);

                // Scroll to target with enhanced smoothness
                const targetScrollTop = targetPositions[index];

                // Use smooth scroll with callback
                smoothScrollTo(targetScrollTop, 800);
            }
        });
    });

    logoLink.addEventListener('click', (e) => {
        e.preventDefault();

        // Add click effect to logo
        const logoGlow = logoLink.querySelector('.scroll-nav-logo-glow');
        if (logoGlow) {
            logoGlow.style.opacity = '1';
            logoGlow.style.transform = 'scale(2)';
            setTimeout(() => {
                logoGlow.style.opacity = '0';
                logoGlow.style.transform = 'scale(1)';
            }, 800);
        }

        // Scroll to top with enhanced smoothness
        smoothScrollTo(0, 800);

        // Update section name only on mobile
        if (currentSectionDisplay && window.innerWidth < 1024) {
            currentSectionDisplay.style.opacity = '0';
            setTimeout(() => {
                currentSectionDisplay.textContent = 'Top';
                currentSectionDisplay.style.opacity = '1';
            }, 200);
        }
    });

    // Enhanced smooth scroll function
    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const difference = targetY - startY;
        const startTime = performance.now();

        function step() {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use easing function for smoother motion
            const easeProgress = easeInOutCubic(progress);

            window.scrollTo(0, startY + difference * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    // --- Initial Call & Attach Listener ---
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Enhanced Resize Handler ---
    let resizeTimeout;
    let lastScreenWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isDesktopMode = window.innerWidth >= 1024;
            const wasDesktopMode = lastScreenWidth >= 1024;
            const layoutChanged = (isDesktopMode !== wasDesktopMode);

            // Update for next resize check
            lastScreenWidth = window.innerWidth;

            // Handle layout transition animations
            if (layoutChanged) {
                // Reset any existing transforms
                scrollNav.style.transition = 'none';
                scrollNav.style.transform = isDesktopMode ?
                    'translateY(-50%)' :
                    'translateX(-50%)';

                // Force reflow
                void scrollNav.offsetWidth;

                // Add transition back
                scrollNav.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

                // Apply appropriate animation based on new layout
                if (isDesktopMode) {
                    // Animate for desktop mode
                    scrollNav.style.transform = 'translateY(-50%) scale(0.95)';
                    setTimeout(() => {
                        scrollNav.style.transform = 'translateY(-50%)';
                    }, 300);
                } else {
                    // Animate for mobile mode
                    scrollNav.style.transform = 'translateX(-50%) scale(0.95)';
                    setTimeout(() => {
                        scrollNav.style.transform = 'translateX(-50%)';
                    }, 300);
                }

                // Reset progress bar
                if (isDesktopMode) {
                    revealBar.style.width = '2px';
                    revealBar.style.height = '0';
                } else {
                    revealBar.style.height = '2px';
                    revealBar.style.width = '0';
                }
            } else {
                // Simple scale animation for same layout
                const transform = isDesktopMode ?
                    'translateY(-50%) scale(0.98)' :
                    'translateX(-50%) scale(0.98)';

                scrollNav.style.transform = transform;
                setTimeout(() => {
                    scrollNav.style.transform = isDesktopMode ?
                        'translateY(-50%)' :
                        'translateX(-50%)';
                }, 300);
            }

            // Recalculate positions
            targetPositions.length = 0;
            targetSections.forEach(section => {
                targetPositions.push(section.getBoundingClientRect().top + window.scrollY);
            });

            // Recalculate node positions
            const newFirstNodeOffsetLeft = nodes[0].offsetLeft;
            nodePositionsX.length = 0;
            nodes.forEach(node => {
                nodePositionsX.push(node.offsetLeft - newFirstNodeOffsetLeft + (node.offsetWidth / 2));
            });

            // Update the navigation state
            handleScroll();
        }, 250);
    });
}

// Testimonials section has been removed

// --- QR Video Scroll Trigger Function ---
function setupQRVideoScrollTrigger() {
    const qrVideo = document.getElementById('qr-video');
    if (!qrVideo) {
        console.warn("QR video element not found.");
        return;
    }

    let hasPlayed = false;
    let isVideoVisible = false;

    // Create intersection observer for the QR video
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVideoVisible = entry.isIntersecting;

            if (entry.isIntersecting && !hasPlayed) {
                // Video is visible and hasn't played yet - start playing
                qrVideo.play().then(() => {
                    console.log("QR video started playing");
                    hasPlayed = true;
                }).catch(error => {
                    console.error("Error playing QR video:", error);
                });
            } else if (!entry.isIntersecting && qrVideo.currentTime > 0 && !qrVideo.ended) {
                // Video is not visible and is currently playing - pause it
                qrVideo.pause();
            }
        });
    }, {
        threshold: 0.5, // Trigger when 50% of the video is visible
        rootMargin: '0px 0px -50px 0px' // Add some margin to trigger slightly before fully visible
    });

    // Start observing the video
    videoObserver.observe(qrVideo);

    // Handle video ended event - stop at last frame
    qrVideo.addEventListener('ended', () => {
        console.log("QR video finished playing");
        // Video will naturally stop at the last frame
        // We can add any additional effects here if needed

        // Optional: Add a subtle glow effect when video ends
        const qrContainer = qrVideo.closest('.qr-code-container');
        if (qrContainer) {
            qrContainer.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            setTimeout(() => {
                qrContainer.style.boxShadow = '';
            }, 2000);
        }
    });

    // Handle video error
    qrVideo.addEventListener('error', (e) => {
        console.error("QR video error:", e);
        // Show fallback content
        const qrContainer = qrVideo.closest('.qr-code-container');
        if (qrContainer) {
            qrContainer.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gray-800 rounded-xl">
                    <div class="text-center text-white p-4">
                        <i class="fas fa-qrcode text-4xl mb-2 opacity-50"></i>
                        <p class="text-sm opacity-70">QR Code</p>
                    </div>
                </div>
            `;
        }
    });

    // Ensure video is muted for autoplay compliance
    qrVideo.muted = true;
    qrVideo.playsInline = true;

    // Optional: Reset video when scrolling back up past it
    window.addEventListener('scroll', () => {
        if (!isVideoVisible && hasPlayed && qrVideo.currentTime > 0) {
            // If we've scrolled away from the video and it has played,
            // we could reset it for next time (optional)
            // Uncomment the next line if you want the video to reset when scrolled away
            // qrVideo.currentTime = 0;
            // hasPlayed = false;
        }
    }, { passive: true });
}

// --- Modern Animation System ---
function setupModernAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Add immediate visibility to all animated elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.add('is-visible');
        });
        return;
    }

    // Enhanced Intersection Observer for scroll-triggered animations
    window.animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate;
                const delay = element.dataset.delay || 0;

                setTimeout(() => {
                    element.classList.add('is-visible');

                    // Handle specific animation types
                    switch (animationType) {
                        case 'typewriter':
                            startTypewriterEffect(element);
                            break;
                        case 'counter':
                            startCounterAnimation(element);
                            break;
                        case 'stagger':
                            startStaggerAnimation(element);
                            break;
                        case 'slide-up':
                            element.classList.add('animate-slide-up');
                            break;
                        case 'slide-left':
                            element.classList.add('animate-slide-left');
                            break;
                        case 'slide-right':
                            element.classList.add('animate-slide-right');
                            break;
                        case 'scale-in':
                            element.classList.add('animate-scale-in');
                            break;
                        case 'fade-in':
                            element.classList.add('animate-fade-in');
                            break;
                        case 'text-reveal':
                            startTextRevealAnimation(element);
                            break;
                        case 'word-by-word':
                            startWordByWordAnimation(element);
                            break;
                        case 'letter-by-letter':
                            startLetterByLetterAnimation(element);
                            break;
                    }
                }, parseInt(delay));

                // Stop observing once animated (performance optimization)
                window.animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animation data attributes
    document.querySelectorAll('[data-animate]').forEach(el => {
        window.animationObserver.observe(el);
    });

    // Setup enhanced scroll animations for all sections
    setupSectionScrollAnimations();

    // Setup parallax effects for desktop only
    if (window.innerWidth >= 768) {
        setupParallaxEffects();
    }

    // Setup enhanced hover effects
    setupEnhancedHoverEffects();

    // Setup typewriter effects for key phrases
    setupTypewriterEffects();

    // Setup number counter animations
    setupCounterAnimations();

    // Setup text reveal animations
    setupTextRevealAnimations();
}

// Typewriter Effect Function
function startTypewriterEffect(element) {
    const text = element.textContent;
    const speed = parseInt(element.dataset.typewriterSpeed) || 50;

    element.textContent = '';
    element.style.borderRight = '2px solid currentColor';

    let i = 0;
    const typeInterval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;

        if (i >= text.length) {
            clearInterval(typeInterval);
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }, speed);
}

// Counter Animation Function
function startCounterAnimation(element) {
    const target = parseInt(element.dataset.counterTarget) || 0;
    const duration = parseInt(element.dataset.counterDuration) || 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(target * easeOutQuart);

        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Stagger Animation Function
function startStaggerAnimation(element) {
    const children = element.children;
    const staggerDelay = parseInt(element.dataset.staggerDelay) || 100;

    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('is-visible');
        }, index * staggerDelay);
    });
}

// Parallax Effects Setup
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// Enhanced Hover Effects Setup
function setupEnhancedHoverEffects() {
    // Add enhanced hover classes to buttons
    document.querySelectorAll('button, .btn, a[href]').forEach(element => {
        if (!element.classList.contains('btn-enhanced')) {
            element.classList.add('btn-enhanced');
        }
    });

    // Add enhanced hover classes to cards
    document.querySelectorAll('.feature-card, .card, [class*="card-"]').forEach(element => {
        if (!element.classList.contains('card-enhanced')) {
            element.classList.add('card-enhanced');
        }
    });
}

// Typewriter Effects Setup
function setupTypewriterEffects() {
    // Add typewriter effect to key phrases
    const keyPhrases = document.querySelectorAll('[data-typewriter]');

    keyPhrases.forEach(element => {
        element.classList.add('typewriter');
    });
}

// Counter Animations Setup
function setupCounterAnimations() {
    // Setup counter animations for countdown and statistics
    const counterElements = document.querySelectorAll('[data-counter]');

    counterElements.forEach(element => {
        element.classList.add('animate-counter');
    });

    // Setup counter animations for the stats in Why Choose section
    const statCounters = document.querySelectorAll('.counter[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.target);
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const currentValue = Math.floor(target * easeOutQuart);

                    element.textContent = currentValue;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        element.textContent = target; // Ensure final value is exact
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(element); // Only animate once
            }
        });
    }, {
        threshold: 0.5
    });

    statCounters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Enhanced Text Reveal Animations
function startTextRevealAnimation(element) {
    const text = element.textContent;
    element.innerHTML = `<span class="text-reveal-inner">${text}</span>`;
    element.classList.add('text-reveal');

    setTimeout(() => {
        element.classList.add('is-visible');
    }, 100);
}

function startWordByWordAnimation(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.innerHTML = '';

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = 'all 0.5s ease';
        span.style.display = 'inline-block';
        element.appendChild(span);

        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function startLetterByLetterAnimation(element) {
    const text = element.textContent;
    const letters = text.split('');
    element.innerHTML = '';

    letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = 'all 0.3s ease';
        span.style.display = 'inline-block';
        element.appendChild(span);

        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Setup Text Reveal Animations
function setupTextRevealAnimations() {
    const textRevealElements = document.querySelectorAll('[data-text-reveal]');

    textRevealElements.forEach(element => {
        const revealType = element.dataset.textReveal;

        switch (revealType) {
            case 'word-by-word':
                element.dataset.animate = 'word-by-word';
                break;
            case 'letter-by-letter':
                element.dataset.animate = 'letter-by-letter';
                break;
            default:
                element.dataset.animate = 'text-reveal';
        }
    });
}

// Enhanced Section Scroll Animations
function setupSectionScrollAnimations() {
    // Add scroll animations to all major sections
    const sections = document.querySelectorAll('section');

    sections.forEach((section, index) => {
        // Add staggered entrance animations to section content
        const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = section.querySelectorAll('p');
        const cards = section.querySelectorAll('.card, .feature-card, .roadmap-item');
        const buttons = section.querySelectorAll('a, button');

        // Animate headings
        headings.forEach((heading, i) => {
            if (!heading.dataset.animate) {
                heading.dataset.animate = 'slide-up';
                heading.dataset.delay = (i * 200).toString();
            }
        });

        // Animate paragraphs
        paragraphs.forEach((p, i) => {
            if (!p.dataset.animate && p.textContent.trim().length > 0) {
                p.dataset.animate = 'fade-in';
                p.dataset.delay = ((headings.length * 200) + (i * 150)).toString();
            }
        });

        // Animate cards with stagger
        cards.forEach((card, i) => {
            if (!card.dataset.animate) {
                card.dataset.animate = 'scale-in';
                card.dataset.delay = (i * 200).toString();
            }
        });

        // Animate buttons
        buttons.forEach((button, i) => {
            if (!button.dataset.animate && button.closest('section') === section) {
                button.dataset.animate = 'slide-up';
                button.dataset.delay = ((headings.length + paragraphs.length) * 150 + (i * 100)).toString();
            }
        });
    });

    // Re-observe all new animated elements
    const newAnimatedElements = document.querySelectorAll('[data-animate]:not(.observed)');
    newAnimatedElements.forEach(el => {
        el.classList.add('observed');
        if (window.animationObserver) {
            window.animationObserver.observe(el);
        }
    });
}

// --- Whitelist Video Modal Function ---
function setupWhitelistVideoModal() {
    const fingerprintClickable = document.querySelector('.fingerprint-clickable');
    const videoModal = document.getElementById('whitelist-video-modal');
    const closeModalBtn = document.getElementById('close-video-modal');
    const whitelistVideo = document.getElementById('whitelist-video');
    const videoLoading = document.getElementById('video-loading');
    const joinWhitelistCTA = document.getElementById('join-whitelist-cta');

    if (!fingerprintClickable || !videoModal || !closeModalBtn || !whitelistVideo) {
        console.warn("Whitelist video modal elements not found.");
        return;
    }

    // Function to open modal with cool effects
    function openVideoModal() {
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';

        // Show modal with fade in
        videoModal.classList.remove('opacity-0', 'pointer-events-none');
        videoModal.classList.add('opacity-100', 'pointer-events-auto');

        // Animate modal content
        const modalContent = videoModal.querySelector('.modal-content');
        if (modalContent) {
            setTimeout(() => {
                modalContent.classList.remove('scale-90');
                modalContent.classList.add('scale-100');
            }, 100);
        }

        // Hide loading overlay when video is ready
        if (whitelistVideo.readyState >= 3) {
            // Video is ready to play
            hideVideoLoading();
        } else {
            // Wait for video to load
            whitelistVideo.addEventListener('canplay', hideVideoLoading, { once: true });
            whitelistVideo.addEventListener('loadeddata', hideVideoLoading, { once: true });
        }

        // Auto-play video if possible (muted for autoplay compliance)
        whitelistVideo.muted = true;
        whitelistVideo.play().catch(error => {
            console.log("Auto-play prevented:", error);
            // Show play button or instructions if autoplay fails
        });

        // Add accessibility announcement
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('sr-only');
        announcement.textContent = 'Whitelist video modal opened';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Function to close modal
    function closeVideoModal() {
        // Animate modal content out
        const modalContent = videoModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-90');
        }

        // Fade out modal
        setTimeout(() => {
            videoModal.classList.remove('opacity-100', 'pointer-events-auto');
            videoModal.classList.add('opacity-0', 'pointer-events-none');

            // Restore body scrolling
            document.body.style.overflow = '';

            // Pause and reset video
            whitelistVideo.pause();
            whitelistVideo.currentTime = 0;

            // Show loading overlay again for next time
            if (videoLoading) {
                videoLoading.style.display = 'flex';
            }
        }, 200);

        // Add accessibility announcement
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('sr-only');
        announcement.textContent = 'Whitelist video modal closed';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Function to hide video loading overlay
    function hideVideoLoading() {
        if (videoLoading) {
            videoLoading.style.opacity = '0';
            setTimeout(() => {
                videoLoading.style.display = 'none';
            }, 300);
        }
    }

    // Event Listeners

    // Open modal when fingerprint is clicked
    fingerprintClickable.addEventListener('click', (e) => {
        e.preventDefault();
        openVideoModal();
    });

    // Handle keyboard accessibility for fingerprint
    fingerprintClickable.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openVideoModal();
        }
    });

    // Close modal when close button is clicked
    closeModalBtn.addEventListener('click', closeVideoModal);

    // Close modal when clicking outside the content
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !videoModal.classList.contains('opacity-0')) {
            closeVideoModal();
        }
    });

    // Handle Join Whitelist CTA click
    if (joinWhitelistCTA) {
        joinWhitelistCTA.addEventListener('click', (e) => {
            e.preventDefault();

            // Close the modal first
            closeVideoModal();

            // Wait for modal to close, then scroll to QR code
            setTimeout(() => {
                const qrCodeSection = document.querySelector('.qr-code-container');
                if (qrCodeSection) {
                    qrCodeSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Add highlight effect to QR code
                    qrCodeSection.classList.add('ring-4', 'ring-purple-500', 'ring-opacity-70');
                    setTimeout(() => {
                        qrCodeSection.classList.remove('ring-4', 'ring-purple-500', 'ring-opacity-70');
                    }, 3000);
                }
            }, 500);
        });
    }

    // Handle video errors
    whitelistVideo.addEventListener('error', (e) => {
        console.error("Whitelist video error:", e);
        if (videoLoading) {
            videoLoading.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-play-circle text-purple-400 text-4xl mb-4"></i>
                    <p class="text-white text-lg font-medium">Whitelist Information</p>
                    <p class="text-gray-400 text-sm mt-2">Join our waitlist to be among the first to experience Nashop's revolutionary shopping platform.</p>
                    <div class="mt-4 space-y-2 text-left">
                        <div class="flex items-center text-purple-300">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span class="text-sm">Early access to the platform</span>
                        </div>
                        <div class="flex items-center text-cyan-300">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span class="text-sm">Exclusive $DAN token rewards</span>
                        </div>
                        <div class="flex items-center text-fuchsia-300">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span class="text-sm">VIP member benefits</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    // Preload video metadata for better performance
    whitelistVideo.preload = 'metadata';
}

// --- Optional: Copy to Clipboard Helper Function ---
// (Keep if you plan to add copy buttons, otherwise remove)
function copyToClipboard(text, buttonElement) {
   if (!navigator.clipboard) {
      console.warn("Clipboard API not available.");
      // Implement fallback if needed (e.g., using document.execCommand)
      return;
   }

   navigator.clipboard.writeText(text).then(() => {
       const originalText = buttonElement.innerHTML;
       // Indicate success
       buttonElement.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
       buttonElement.classList.add('bg-green-600', 'border-green-500'); // Add temporary success styles
       // Revert after a delay
       setTimeout(() => {
           buttonElement.innerHTML = originalText;
           buttonElement.classList.remove('bg-green-600', 'border-green-500');
       }, 2000); // 2 seconds
   }).catch(err => {
       console.error('Failed to copy text: ', err);
       const originalText = buttonElement.innerHTML;
       // Indicate failure
       buttonElement.innerHTML = '<i class="fas fa-times mr-1"></i> Failed';
       buttonElement.classList.add('bg-red-600', 'border-red-500'); // Add temporary error styles
       // Revert after a delay
        setTimeout(() => {
           buttonElement.innerHTML = originalText;
           buttonElement.classList.remove('bg-red-600', 'border-red-500');
       }, 2500); // 2.5 seconds
   });
}

// --- Performance Mode Toggle ---
function setupPerformanceModeToggle() {
    const perfToggle = document.getElementById('perf-toggle');
    if (perfToggle) {
        perfToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('performance-mode');
                // Optional: Save user preference in localStorage
                localStorage.setItem('performanceMode', 'enabled');
            } else {
                document.body.classList.remove('performance-mode');
                localStorage.setItem('performanceMode', 'disabled');
            }
        });

        // Check for saved preference on page load
        if (localStorage.getItem('performanceMode') === 'enabled') {
            perfToggle.checked = true;
            document.body.classList.add('performance-mode');
        }
    }
}
