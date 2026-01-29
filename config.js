/**
 * GeoPhotoAI - Configuration
 */

const CONFIG = {
    // ============================================
    // App Settings
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
