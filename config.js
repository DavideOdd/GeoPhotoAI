/**
 * GeoPhotoAI - Configuration
 */

const CONFIG = {
    // ============================================
    // App Settings
    // ============================================

    // Default AI service ('nano-banana-fast', 'nano-banana-pro', 'pollinations', or 'dezgo')
    DEFAULT_AI_SERVICE: 'nano-banana-fast',

    // Image generation timeout in milliseconds
    GENERATION_TIMEOUT: 120000,

    // Maximum caption length
    MAX_CAPTION_LENGTH: 200,

    // App version
    VERSION: '1.2.0',

    // ============================================
    // Nano Banana / Google Gemini Settings
    // ============================================

    // Google API Key (optional - leave empty to use Puter.js)
    // Get your key from: https://aistudio.google.com/apikey
    GOOGLE_API_KEY: '',

    // Model mapping for each service
    NANO_BANANA_MODELS: {
        'nano-banana-fast': 'gemini-2.5-flash-preview-image-generation',
        'nano-banana-pro': 'gemini-2.0-flash-exp-image-generation'
    }
};

// Make config globally available
window.CONFIG = CONFIG;
