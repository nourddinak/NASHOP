// countdown.js - Enhanced Countdown Timer with Flip Animation

document.addEventListener('DOMContentLoaded', function() {
    // Set the target date: January 5, 2026
    const targetDate = new Date('January 5, 2026 00:00:00').getTime();

    // Set the start date (when the countdown began)
    const startDate = new Date('January 1, 2023 00:00:00').getTime();

    // Store previous values for flip animation
    let prevDays = 0;
    let prevHours = 0;
    let prevMinutes = 0;
    let prevSeconds = 0;

    // Initialize next values
    document.getElementById('days-next').textContent = '00';
    document.getElementById('hours-next').textContent = '00';
    document.getElementById('minutes-next').textContent = '00';
    document.getElementById('seconds-next').textContent = '00';

    // Function to handle flip animation
    function flipCard(elementId, newValue) {
        const flipCard = document.getElementById(`${elementId}-flip`);
        const currentElement = document.getElementById(elementId);
        const nextElement = document.getElementById(`${elementId}-next`);

        if (currentElement.textContent !== newValue) {
            // Update the back face with new value
            nextElement.textContent = newValue;

            // Add flip class
            flipCard.style.transform = 'rotateX(180deg)';

            // After animation completes, reset the flip and update front face
            setTimeout(() => {
                flipCard.style.transition = 'none';
                flipCard.style.transform = 'rotateX(0deg)';
                currentElement.textContent = newValue;

                // Re-enable transition after reset
                setTimeout(() => {
                    flipCard.style.transition = 'transform 500ms';
                }, 50);
            }, 500);
        }
    }

    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();

        // Calculate the time remaining
        const timeRemaining = targetDate - now;

        // Calculate time values only
        const totalDuration = targetDate - startDate;
        const elapsedTime = now - startDate;

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Format values with leading zeros
        const daysStr = days.toString().padStart(2, '0');
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        // Update seconds circle progress
        const secondsCircle = document.getElementById('seconds-circle');
        if (secondsCircle) {
            // Calculate dashoffset based on seconds (283 is the circumference of the circle)
            const dashOffset = 283 - ((seconds / 60) * 283);
            secondsCircle.style.strokeDashoffset = dashOffset;
        }

        // Check if values have changed and trigger flip animations
        if (days !== prevDays) {
            flipCard('days', daysStr);
            prevDays = days;
        }

        if (hours !== prevHours) {
            flipCard('hours', hoursStr);
            prevHours = hours;
        }

        if (minutes !== prevMinutes) {
            flipCard('minutes', minutesStr);
            prevMinutes = minutes;
        }

        if (seconds !== prevSeconds) {
            flipCard('seconds', secondsStr);
            prevSeconds = seconds;
        }

        // If the countdown is over, display a message
        if (timeRemaining < 0) {
            clearInterval(countdownTimer);

            // Set all displays to 00
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';

            document.getElementById('days-next').textContent = '00';
            document.getElementById('hours-next').textContent = '00';
            document.getElementById('minutes-next').textContent = '00';
            document.getElementById('seconds-next').textContent = '00';

            // Countdown has ended

            // Add launch message
            const countdownContainer = document.querySelector('.countdown-container');
            const launchMessage = document.createElement('div');
            launchMessage.className = 'absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-xl z-50 animate-fade-in';
            launchMessage.innerHTML = `
                <div class="text-center">
                    <h3 class="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 text-transparent bg-clip-text mb-4">We're Live!</h3>
                    <p class="text-gray-300 mb-6">Nashop has officially launched.</p>
                    <a href="#" class="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-cyan-700 transition-all duration-300">
                        Enter Platform
                        <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            `;

            if (countdownContainer) {
                countdownContainer.parentNode.style.position = 'relative';
                countdownContainer.parentNode.appendChild(launchMessage);
            }
        }
    }, 1000);

    // No notification or social sharing functionality needed

    // Add animation classes
    document.documentElement.style.setProperty('--animate-duration', '.8s');

    // Add shooting star animation
    function createShootingStar() {
        const shootingStars = document.querySelectorAll('.shooting-star');
        shootingStars.forEach(star => {
            // Randomize position and angle
            const top = Math.random() * 80 + 10; // 10-90%
            const left = -10; // Start off-screen
            const rotate = Math.random() * 30 + 5; // 5-35 degrees
            const width = Math.random() * 100 + 50; // 50-150px

            star.style.top = `${top}%`;
            star.style.left = `${left}%`;
            star.style.width = `${width}px`;
            star.style.transform = `rotate(${rotate}deg)`;

            // Reset animation
            star.style.animation = 'none';
            star.offsetHeight; // Trigger reflow
            star.style.animation = `shooting-star ${Math.random() * 2 + 1}s linear forwards`;
        });
    }

    // Periodically create new shooting stars
    setInterval(createShootingStar, 5000);
    createShootingStar(); // Initial call
});
