/**
 * GeoPhotoAI - Configuration
 *
 * IMPORTANT: Replace the placeholder values below with your EmailJS credentials.
 * See README.md for setup instructions.
 */

const CONFIG = {
    // ============================================
    // EmailJS Configuration
    // ============================================
    // Get these values from https://www.emailjs.com/

    // Your EmailJS Public Key (Account > General > Public Key)
    EMAILJS_PUBLIC_KEY: '',

    // Your EmailJS Service ID (Email Services > Your Service > Service ID)
    EMAILJS_SERVICE_ID: '',

    // Your EmailJS Template ID (Email Templates > Your Template > Template ID)
    EMAILJS_TEMPLATE_ID: '',

    // ============================================
    // App Settings (optional customization)
    // ============================================

    // Default AI service ('pollinations' or 'dezgo')
    DEFAULT_AI_SERVICE: 'pollinations',

    // Image generation timeout in milliseconds
    GENERATION_TIMEOUT: 120000,

    // App version
    VERSION: '1.0.0'
};

// Make config globally available
window.CONFIG = CONFIG;
