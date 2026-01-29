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
        const location = photoData?.location || {};
        const weather = photoData?.weather || {};
        const settings = photoData?.settings || {};
        const timestamp = photoData?.timestamp || Date.now();

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

        // Use safe fallbacks for all values
        const safeGet = (val, fallback = 'N/A') => (val !== undefined && val !== null && val !== '') ? val : fallback;

        return `
===============================
   GeoPhotoAI - Photo Data
===============================

Location: ${safeGet(location.city, 'Unknown')}, ${safeGet(location.country, 'Unknown')}
Coordinates: ${safeGet(location.coordinates, 'N/A')}
Weather: ${safeGet(weather.condition, 'Unknown')}, ${safeGet(weather.temperature, 'N/A')}
Humidity: ${safeGet(weather.humidity, 'N/A')}
Wind: ${safeGet(weather.windSpeed, 'N/A')} ${safeGet(weather.windDirection, '')}
Date: ${dateStr}
Time: ${timeStr}

===============================
   Camera Settings
===============================

Film: ${safeGet(settings.filmName, 'Unknown')}
Format: ${safeGet(settings.format, 'Unknown')}
Aperture: ${safeGet(settings.aperture, 'N/A')}
Shutter: ${safeGet(settings.shutter, 'N/A')}
ISO: ${safeGet(settings.iso, 'N/A')}
Filter: ${safeGet(settings.filter, 'None')}
Grain: ${safeGet(settings.grain, 'None')}
Vignette: ${safeGet(settings.vignette, 'None')}

===============================

Generated with GeoPhotoAI
${typeof window !== 'undefined' ? window.location.href : 'https://geophotoai.com'}
        `.trim();
    },

    /**
     * Safely get a value with fallback
     * @param {*} value - The value to check
     * @param {string} fallback - Fallback value if undefined/null
     * @returns {string}
     */
    safeValue(value, fallback = 'N/A') {
        if (value === undefined || value === null || value === '') {
            return fallback;
        }
        return String(value);
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

        // Validate photoData structure before using
        if (!photoData || !photoData.location || !photoData.weather || !photoData.settings) {
            throw new Error('Invalid photo data. Please capture a photo first.');
        }

        const formattedData = this.formatPhotoData(photoData);

        // Prepare template parameters with safe fallbacks for all values
        const templateParams = {
            to_email: this.safeValue(toEmail, ''),
            to_name: this.safeValue(toEmail ? toEmail.split('@')[0] : '', 'Friend'),
            message: this.safeValue(message, 'Check out this photo I created with GeoPhotoAI!'),
            image_url: this.safeValue(imageUrl, ''),
            photo_data: this.safeValue(formattedData, 'Photo data not available'),
            location: `${this.safeValue(photoData.location.city, 'Unknown City')}, ${this.safeValue(photoData.location.country, 'Unknown Country')}`,
            weather: `${this.safeValue(photoData.weather.condition, 'Unknown')}, ${this.safeValue(photoData.weather.temperature, 'N/A')}`,
            film: this.safeValue(photoData.settings.filmName, 'Unknown Film'),
            date: this.safeValue(new Date(photoData.timestamp || Date.now()).toLocaleDateString(), new Date().toLocaleDateString())
        };

        // Log template params for debugging
        console.log('Email template params:', templateParams);

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
            console.error('Template params that failed:', templateParams);
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
