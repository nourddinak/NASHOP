#!/usr/bin/env python3
"""
QR Code Generator with Scan Notification System
Generates QR codes for URLs and sends notifications when scanned
"""

import qrcode
import io
import base64
import uuid
import json
import time
from datetime import datetime
from urllib.parse import quote, unquote
from flask import Flask, request, jsonify, render_template_string, send_file
from flask_cors import CORS
import threading
import os
from PIL import Image, ImageDraw, ImageFont

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app)

# Store active QR codes and their metadata
active_qr_codes = {}
scan_notifications = []

class QRCodeGenerator:
    def __init__(self):
        self.qr_codes_dir = "generated_qr_codes"
        if not os.path.exists(self.qr_codes_dir):
            os.makedirs(self.qr_codes_dir)
    
    def generate_qr_code(self, url, custom_id=None):
        """Generate a QR code for the given URL with tracking"""
        if custom_id is None:
            custom_id = str(uuid.uuid4())
        
        # Create tracking URL that includes our notification endpoint
        encoded_url = quote(url, safe='')
        # Auto-detect server URL (works for local and cloud deployment)
        import os
        server_url = os.environ.get('SERVER_URL', 'https://nourddinak.pythonanywhere.com')
        tracking_url = f"{server_url}/track/{custom_id}?redirect={encoded_url}"
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(tracking_url)
        qr.make(fit=True)
        
        # Create QR code image with custom styling
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Add some styling (optional)
        img = self.add_logo_to_qr(img)
        
        # Save the image
        filename = f"qr_{custom_id}.png"
        filepath = os.path.join(self.qr_codes_dir, filename)
        img.save(filepath)
        
        # Store metadata
        active_qr_codes[custom_id] = {
            'id': custom_id,
            'original_url': url,
            'tracking_url': tracking_url,
            'created_at': datetime.now().isoformat(),
            'scan_count': 0,
            'filepath': filepath,
            'filename': filename
        }
        
        return custom_id, tracking_url, filepath
    
    def add_logo_to_qr(self, qr_img):
        """Add a small logo or styling to the QR code center (optional)"""
        # For now, just return the original image
        # You can add logo overlay logic here if needed
        return qr_img
    
    def get_qr_code_base64(self, qr_id):
        """Get QR code as base64 string for web display"""
        if qr_id not in active_qr_codes:
            return None
        
        filepath = active_qr_codes[qr_id]['filepath']
        if not os.path.exists(filepath):
            return None
        
        with open(filepath, "rb") as img_file:
            img_data = img_file.read()
            base64_string = base64.b64encode(img_data).decode('utf-8')
            return f"data:image/png;base64,{base64_string}"

# Initialize QR generator
qr_generator = QRCodeGenerator()

@app.route('/')
def index():
    """Main page to generate and display QR codes"""
    return render_template_string('''
    <!DOCTYPE html>
    <html>
    <head>
        <title>QR Code Generator</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a1a; color: white; }
            .container { max-width: 800px; margin: 0 auto; }
            .qr-display { text-align: center; margin: 20px 0; }
            .qr-image { max-width: 300px; border: 2px solid #333; border-radius: 10px; }
            .notification { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #00ff00; }
            input, button { padding: 10px; margin: 5px; border-radius: 5px; border: 1px solid #333; }
            input { background: #2a2a2a; color: white; width: 300px; }
            button { background: #0066cc; color: white; cursor: pointer; }
            button:hover { background: #0052a3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>QR Code Generator with Scan Tracking</h1>
            
            <div>
                <input type="text" id="urlInput" placeholder="Enter URL to generate QR code" value="https://example.com">
                <button onclick="generateQR()">Generate QR Code</button>
            </div>
            
            <div id="qrDisplay" class="qr-display"></div>
            
            <div>
                <h3>Scan Notifications:</h3>
                <div id="notifications"></div>
            </div>
        </div>
        
        <script>
            const socket = io();
            
            socket.on('qr_scanned', function(data) {
                console.log('QR Code scanned:', data);
                addNotification(data);
                // This is where you'd trigger your video in the main HTML
                triggerVideoPlay(data);
            });
            
            function generateQR() {
                const url = document.getElementById('urlInput').value;
                if (!url) {
                    alert('Please enter a URL');
                    return;
                }
                
                fetch('/generate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({url: url})
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayQR(data);
                    } else {
                        alert('Error generating QR code');
                    }
                });
            }
            
            function displayQR(data) {
                const display = document.getElementById('qrDisplay');
                display.innerHTML = `
                    <h3>QR Code Generated</h3>
                    <img src="${data.qr_image}" class="qr-image" alt="QR Code">
                    <p>QR ID: ${data.qr_id}</p>
                    <p>Tracking URL: <a href="${data.tracking_url}" target="_blank">${data.tracking_url}</a></p>
                    <p>Original URL: ${data.original_url}</p>
                `;
            }
            
            function addNotification(data) {
                const notifications = document.getElementById('notifications');
                const notification = document.createElement('div');
                notification.className = 'notification';
                notification.innerHTML = `
                    <strong>QR Code Scanned!</strong><br>
                    QR ID: ${data.qr_id}<br>
                    Time: ${new Date(data.timestamp).toLocaleString()}<br>
                    User Agent: ${data.user_agent || 'Unknown'}<br>
                    IP: ${data.ip || 'Unknown'}
                `;
                notifications.insertBefore(notification, notifications.firstChild);
            }
            
            function triggerVideoPlay(data) {
                // This function will be called when QR is scanned
                // You can customize this to trigger your specific video
                console.log('Triggering video play for scan:', data);
            }
        </script>
    </body>
    </html>
    ''')

@app.route('/generate', methods=['POST'])
def generate_qr():
    """Generate a new QR code"""
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'success': False, 'error': 'URL is required'})

    try:
        qr_id, tracking_url, filepath = qr_generator.generate_qr_code(url)
        qr_image_base64 = qr_generator.get_qr_code_base64(qr_id)

        return jsonify({
            'success': True,
            'qr_id': qr_id,
            'tracking_url': tracking_url,
            'original_url': url,
            'qr_image': qr_image_base64
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/track/<qr_id>')
def track_scan(qr_id):
    """Handle QR code scan and send notification"""
    if qr_id not in active_qr_codes:
        return "QR Code not found", 404

    # Get scan information
    user_agent = request.headers.get('User-Agent', 'Unknown')
    ip_address = request.remote_addr
    timestamp = datetime.now().isoformat()

    # Update scan count
    active_qr_codes[qr_id]['scan_count'] += 1

    # Create notification data
    notification_data = {
        'qr_id': qr_id,
        'timestamp': timestamp,
        'user_agent': user_agent,
        'ip': ip_address,
        'scan_count': active_qr_codes[qr_id]['scan_count']
    }

    # Store notification
    scan_notifications.append(notification_data)

    # Store notification for polling (PythonAnywhere compatible)
    # No WebSocket needed - using polling instead

    # Redirect to original URL
    encoded_redirect = request.args.get('redirect', active_qr_codes[qr_id]['original_url'])
    redirect_url = unquote(encoded_redirect) if encoded_redirect else active_qr_codes[qr_id]['original_url']
    return f'''
    <html>
    <head>
        <title>Redirecting...</title>
        <meta http-equiv="refresh" content="2;url={redirect_url}">
    </head>
    <body style="background: #1a1a1a; color: white; text-align: center; padding: 50px;">
        <h2>QR Code Scanned Successfully!</h2>
        <p>Redirecting to: {redirect_url}</p>
        <p>If you're not redirected automatically, <a href="{redirect_url}" style="color: #00ff00;">click here</a></p>
    </body>
    </html>
    '''

@app.route('/qr/<qr_id>')
def get_qr_image(qr_id):
    """Serve QR code image"""
    if qr_id not in active_qr_codes:
        return "QR Code not found", 404

    filepath = active_qr_codes[qr_id]['filepath']
    if not os.path.exists(filepath):
        return "QR Code image not found", 404

    return send_file(filepath, mimetype='image/png')

@app.route('/api/notifications')
def get_notifications():
    """Get all scan notifications"""
    return jsonify(scan_notifications)

@app.route('/api/poll/<qr_id>')
def poll_notifications(qr_id):
    """Poll for new notifications for a specific QR code (PythonAnywhere compatible)"""
    # Get notifications for this QR code from the last 30 seconds
    import time
    current_time = time.time()
    recent_notifications = []

    for notification in scan_notifications:
        if notification['qr_id'] == qr_id:
            # Check if notification is recent (last 30 seconds)
            notification_time = datetime.fromisoformat(notification['timestamp']).timestamp()
            if current_time - notification_time < 30:
                recent_notifications.append(notification)

    return jsonify({
        'notifications': recent_notifications,
        'count': len(recent_notifications)
    })

@app.route('/api/qr-codes')
def get_qr_codes():
    """Get all active QR codes"""
    return jsonify(list(active_qr_codes.values()))



if __name__ == '__main__':
    print("Starting QR Code Generator Server...")
    print("Access the generator at: https://nourddinak.pythonanywhere.com")
    print("Polling notifications enabled for PythonAnywhere compatibility")
    app.run(debug=True, host='0.0.0.0', port=5000)
