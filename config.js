/**
 * GeoPhotoAI - Configuration
 */

const CONFIG = {
    // ============================================
    // EmailJS Configuration
    // ============================================
    // Get these values from https://www.emailjs.com/

    // Your EmailJS Public Key (Account > General > Public Key)
    EMAILJS_PUBLIC_KEY: 'ujq30eb0nXJjojxXx',

    // Your EmailJS Service ID (Email Services > Your Service > Service ID)
    EMAILJS_SERVICE_ID: 'service_tgax72c',

    // Your EmailJS Template ID (Email Templates > Your Template > Template ID)
    EMAILJS_TEMPLATE_ID: 'template_g9511h6',

    // ============================================
    // App Settings (optional customization)
    // ============================================

    // Default AI service ('pollinations' or 'dezgo')
    DEFAULT_AI_SERVICE: 'pollinations',

    // Image generation timeout in milliseconds
    GENERATION_TIMEOUT: 120000,

    // Maximum caption length
    MAX_CAPTION_LENGTH: 200,

    // App version
    VERSION: '1.1.0'
};

// Make config globally available
window.CONFIG = CONFIG;
