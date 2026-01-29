/**
 * GeoPhotoAI - Email Module
 * Handles email sending via EmailJS
 */

const EmailService = {
    // Initialization status
    initialized: false,

    /**
     * Initialize EmailJS with public key
     */
    init() {
        if (this.initialized) return;

        if (typeof emailjs === 'undefined') {
            console.error('EmailJS SDK not loaded');
            return;
        }

        if (!CONFIG.EMAILJS_PUBLIC_KEY || CONFIG.EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
            console.warn('EmailJS not configured. Please set up config.js');
            return;
        }

        emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
        this.initialized = true;
        console.log('EmailJS initialized');
    },

    /**
     * Check if EmailJS is properly configured
     * @returns {boolean}
     */
    isConfigured() {
        return CONFIG.EMAILJS_PUBLIC_KEY &&
               CONFIG.EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE' &&
               CONFIG.EMAILJS_SERVICE_ID &&
               CONFIG.EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID_HERE' &&
               CONFIG.EMAILJS_TEMPLATE_ID &&
               CONFIG.EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID_HERE';
    },

    /**
     * Format photo data for email body
     * @param {object} photoData
     * @returns {string} Formatted data string
     */
    formatPhotoData(photoData) {
        const {
            location,
            weather,
            settings,
            timestamp
        } = photoData;

        const date = new Date(timestamp);
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
═══════════════════════════════
   GeoPhotoAI - Photo Data
═══════════════════════════════

📍 Location: ${location.city}, ${location.country}
🌐 Coordinates: ${location.coordinates}
🌡️ Weather: ${weather.condition}, ${weather.temperature}
💧 Humidity: ${weather.humidity}
💨 Wind: ${weather.windSpeed} ${weather.windDirection}
📅 Date: ${dateStr}
⏰ Time: ${timeStr}

═══════════════════════════════
   Camera Settings
═══════════════════════════════

🎞️ Film: ${settings.filmName}
📐 Format: ${settings.format}
📷 Aperture: ${settings.aperture}
⏱️ Shutter: ${settings.shutter}
🔆 ISO: ${settings.iso}
🎨 Filter: ${settings.filter}
✨ Grain: ${settings.grain}
🔲 Vignette: ${settings.vignette}

═══════════════════════════════

Generated with GeoPhotoAI
${window.location.href}
        `.trim();
    },

    /**
     * Send email with photo
     * @param {object} params - Email parameters
     * @returns {Promise}
     */
    async sendEmail(params) {
        const {
            toEmail,
            message,
            imageUrl,
            photoData
        } = params;

        if (!this.isConfigured()) {
            throw new Error('EmailJS is not configured. Please set up config.js with your EmailJS credentials.');
        }

        this.init();

        const formattedData = this.formatPhotoData(photoData);

        // Prepare template parameters
        const templateParams = {
            to_email: toEmail,
            to_name: toEmail.split('@')[0],
            message: message || 'Check out this photo I created with GeoPhotoAI!',
            image_url: imageUrl,
            photo_data: formattedData,
            location: `${photoData.location.city}, ${photoData.location.country}`,
            weather: `${photoData.weather.condition}, ${photoData.weather.temperature}`,
            film: photoData.settings.filmName,
            date: new Date(photoData.timestamp).toLocaleDateString()
        };

        try {
            const response = await emailjs.send(
                CONFIG.EMAILJS_SERVICE_ID,
                CONFIG.EMAILJS_TEMPLATE_ID,
                templateParams
            );

            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Email send error:', error);
            throw new Error('Failed to send email. Please check your EmailJS configuration.');
        }
    },

    /**
     * Send email to multiple recipients
     * @param {object} params
     * @param {string} copyEmail - Optional copy email
     * @returns {Promise}
     */
    async sendEmails(params, copyEmail = null) {
        const results = [];

        // Send to primary recipient
        results.push(await this.sendEmail(params));

        // Send copy if requested
        if (copyEmail) {
            const copyParams = {
                ...params,
                toEmail: copyEmail,
                message: `[Copy] ${params.message || 'Your GeoPhotoAI capture'}`
            };
            results.push(await this.sendEmail(copyParams));
        }

        return results;
    },

    /**
     * Test email configuration
     * @returns {boolean}
     */
    testConfiguration() {
        console.log('EmailJS Configuration Test:');
        console.log('- Public Key:', CONFIG.EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing');
        console.log('- Service ID:', CONFIG.EMAILJS_SERVICE_ID ? 'Set' : 'Missing');
        console.log('- Template ID:', CONFIG.EMAILJS_TEMPLATE_ID ? 'Set' : 'Missing');
        console.log('- Configured:', this.isConfigured());

        return this.isConfigured();
    }
};

// Export for use in other modules
window.EmailService = EmailService;
