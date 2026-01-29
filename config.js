/**
 * GeoPhotoAI - Configuration
 */

const CONFIG = {
    // ============================================
    // App Settings
    // ============================================

    // Default AI service ('pollinations', 'nano-banana', or 'dezgo')
    DEFAULT_AI_SERVICE: 'pollinations',

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

    // Nano Banana model to use
    // Options: 'gemini-2.5-flash-image-preview' (faster) or 'gemini-3-pro-image-preview' (higher quality)
    NANO_BANANA_MODEL: 'gemini-2.5-flash-image-preview',

    // Puter.js model mapping (used when no Google API key)
    PUTER_MODELS: {
        'gemini-2.5-flash-image-preview': 'nano-banana',
        'gemini-3-pro-image-preview': 'nano-banana-pro'
    }
};

// Make config globally available
window.CONFIG = CONFIG;
