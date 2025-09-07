/**
 * QR Code Scan Notification Handler
 * Connects to the QR generator server and handles scan notifications
 * Triggers video playback when QR codes are scanned
 */

class QRNotificationHandler {
    constructor() {
        this.socket = null;
        // Auto-detect server URL - works for local and cloud deployment
        this.serverUrl = window.QR_SERVER_URL || 'https://nourddinak.pythonanywhere.com/';
        this.isConnected = false;
        this.currentQRId = null;
        this.videoElement = null;
        this.qrImageElement = null;
        this.notificationCallbacks = [];
        
        this.init();
    }
    
    init() {
        try {
            // Initialize video element reference
            this.videoElement = document.getElementById('qr-video');
            if (!this.videoElement) {
                console.warn('QR video element not found - video playback may not work');
            }
            
            // Create QR image element if it doesn't exist
            this.createQRImageElement();
            
            // Connect to WebSocket server
            this.connectToServer();
            
            // Add notification display area
            this.createNotificationArea();
            
            console.log('QR Notification Handler initialized successfully');
        } catch (error) {
            console.error('Error initializing QR Notification Handler:', error);
        }
    }
    
    createQRImageElement() {
        // Find the QR code container (try multiple selectors)
        const qrContainer = document.querySelector('.qr-video-container') || 
                           document.querySelector('.qr-code-container') ||
                           document.querySelector('.qr-container');
        if (!qrContainer) {
            console.warn('QR code container not found - QR display may not work properly');
            return;
        }
        
        // Create QR image element that will overlay/replace the video when needed
        this.qrImageElement = document.createElement('img');
        this.qrImageElement.id = 'qr-code-image';
        this.qrImageElement.className = 'w-full h-full rounded-xl object-cover absolute top-0 left-0 z-10 opacity-0 transition-opacity duration-500';
        this.qrImageElement.alt = 'Generated QR Code';
        this.qrImageElement.style.display = 'none';
        
        // Add to container
        qrContainer.appendChild(this.qrImageElement);
    }
    
    createNotificationArea() {
        // Create a notification area for scan alerts
        const notificationArea = document.createElement('div');
        notificationArea.id = 'qr-scan-notifications';
        notificationArea.className = 'fixed top-4 right-4 z-50 max-w-sm';
        notificationArea.style.pointerEvents = 'none';
        
        document.body.appendChild(notificationArea);
    }
    
    connectToServer() {
        try {
            // Use polling instead of WebSockets for PythonAnywhere compatibility
            this.startPolling();
            this.isConnected = true;
            console.log('Connected to QR notification server (polling mode)');
        } catch (error) {
            console.error('Error connecting to QR server:', error);
            this.showConnectionError();
        }
    }
    
    startPolling() {
        // Poll for notifications every 2 seconds (PythonAnywhere compatible)
        if (this.currentQRId) {
            this.pollInterval = setInterval(() => {
                this.checkForNotifications();
            }, 2000);
        }
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    async checkForNotifications() {
        if (!this.currentQRId) return;

        try {
            const response = await fetch(`${this.serverUrl}/api/poll/${this.currentQRId}`);
            const data = await response.json();

            if (data.notifications && data.notifications.length > 0) {
                // Process the most recent notification
                const latestNotification = data.notifications[data.notifications.length - 1];
                console.log('QR Code scanned (polling):', latestNotification);
                
                // Stop polling IMMEDIATELY to prevent repeated triggers
                this.stopPolling();
                this.currentQRId = null; // Clear QR ID to prevent further polling
                
                this.handleQRScan(latestNotification);
            }
        } catch (error) {
            console.error('Error polling for notifications:', error);
            // If polling fails, stop polling to prevent repeated errors
            this.stopPolling();
            this.currentQRId = null;
        }
    }
    
    async generateQRCode(url) {
        try {
            const response = await fetch(`${this.serverUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentQRId = data.qr_id;
                this.displayQRCode(data.qr_image);

                // Start polling for this QR code
                this.startPolling();

                return data;
            } else {
                throw new Error(data.error || 'Failed to generate QR code');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showError('Failed to generate QR code: ' + error.message);
            return null;
        }
    }
    
    displayQRCode(qrImageBase64) {
        if (!this.qrImageElement) {
            console.error('QR image element not found');
            return;
        }
        
        console.log('Displaying QR code:', qrImageBase64);
        console.log('QR image element:', this.qrImageElement);
        
        // Set the QR code image
        this.qrImageElement.src = qrImageBase64;
        this.qrImageElement.style.display = 'block';
        this.qrImageElement.style.position = 'absolute';
        this.qrImageElement.style.top = '0';
        this.qrImageElement.style.left = '0';
        this.qrImageElement.style.width = '100%';
        this.qrImageElement.style.height = '100%';
        this.qrImageElement.style.zIndex = '10';
        this.qrImageElement.style.backgroundColor = 'white';
        this.qrImageElement.style.padding = '10px';
        this.qrImageElement.style.borderRadius = '12px';
        
        // Fade in the QR code
        setTimeout(() => {
            this.qrImageElement.style.opacity = '1';
            console.log('QR code should now be visible');
        }, 100);
        
        // Hide the video while QR is displayed
        if (this.videoElement) {
            this.videoElement.style.display = 'none';
            console.log('Video hidden, QR should be visible');
        }
    }
    
    hideQRCode() {
        if (!this.qrImageElement) return;
        
        // Fade out the QR code
        this.qrImageElement.style.opacity = '0';
        
        setTimeout(() => {
            this.qrImageElement.style.display = 'none';
            
            // Restore video visibility
            if (this.videoElement) {
                this.videoElement.style.opacity = '1';
            }
        }, 500);
    }
    
    handleQRScan(scanData) {
        console.log('Handling QR scan:', scanData);
        
        // Show scan notification
        this.showScanNotification(scanData);
        
        // Call any registered callbacks FIRST (this should trigger our custom handleQRScan)
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(scanData);
            } catch (error) {
                console.error('Error in notification callback:', error);
            }
        });
        
        // Don't call triggerVideoPlay or hideQRCode here - let the callback handle it
        console.log('QR scan handled, callbacks called');
    }
    
    triggerVideoPlay(scanData) {
        if (!this.videoElement) {
            console.error('Video element not found');
            return;
        }

        try {
            // Reset video to beginning
            this.videoElement.currentTime = 0;

            // Play the video
            const playPromise = this.videoElement.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Video started playing due to QR scan');

                        // Add visual effect to indicate scan trigger
                        this.addScanEffect();


                    })
                    .catch(error => {
                        console.error('Error playing video:', error);
                        // Fallback: try to play with user interaction
                        this.requestUserInteractionForVideo();
                    });
            }
        } catch (error) {
            console.error('Error triggering video play:', error);
        }
    }
    
    addScanEffect() {
        // Add a visual effect to show the scan was detected
        const qrContainer = document.querySelector('.qr-video-container') || 
                           document.querySelector('.qr-code-container') ||
                           document.querySelector('.qr-container');
        if (qrContainer) {
            qrContainer.classList.add('animate-pulse');
            qrContainer.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
            
            setTimeout(() => {
                qrContainer.classList.remove('animate-pulse');
                qrContainer.style.boxShadow = '';
            }, 2000);
        }
    }
    
    showScanNotification(scanData) {
        const notificationArea = document.getElementById('qr-scan-notifications');
        if (!notificationArea) return;
        
        const notification = document.createElement('div');
        notification.className = 'bg-green-500 text-white p-4 rounded-lg shadow-lg mb-2 transform translate-x-full transition-transform duration-300 pointer-events-auto';
        
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">QR Code Scanned!</p>
                    <p class="text-xs opacity-90">Scan #${scanData.scan_count}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;
        
        notificationArea.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationArea.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notificationArea.contains(notification)) {
                        notificationArea.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    showConnectionError() {
        console.warn('QR notification server not available');
    }
    
    hideConnectionError() {
        // Hide any connection error UI
    }
    
    showError(message) {
        console.error(message);
    }
    
    // Public methods for external use
    onScanNotification(callback) {
        this.notificationCallbacks.push(callback);
    }
    
    async createQRForCurrentPage() {
        const currentUrl = window.location.href;
        return await this.generateQRCode(currentUrl);
    }
    
    async createQRForURL(url) {
        return await this.generateQRCode(url);
    }
    
    isServerConnected() {
        return this.isConnected;
    }
    
    getCurrentQRId() {
        return this.currentQRId;
    }
}

// Initialize the QR notification handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.qrNotificationHandler = new QRNotificationHandler();
});

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRNotificationHandler;
}
