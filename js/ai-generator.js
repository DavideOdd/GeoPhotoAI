/**
 * GeoPhotoAI - AI Image Generator Module
 * Supports Pollinations.ai and Dezgo (free, no API key)
 */

const AIGenerator = {
    // Current service
    currentService: 'pollinations',

    // Film stock characteristics for prompt enhancement
    filmStocks: {
        'kodak-portra-400': {
            name: 'Kodak Portra 400',
            style: 'warm tones, soft skin tones, natural colors, slight orange cast, professional portrait film look, subtle grain'
        },
        'kodak-ektar-100': {
            name: 'Kodak Ektar 100',
            style: 'highly saturated colors, vibrant, punchy contrast, fine grain, vivid reds and greens, landscape photography style'
        },
        'kodak-trix-400': {
            name: 'Kodak Tri-X 400',
            style: 'black and white, high contrast, classic grain structure, deep blacks, bright highlights, street photography aesthetic'
        },
        'kodak-gold-200': {
            name: 'Kodak Gold 200',
            style: 'warm golden tones, consumer film aesthetic, nostalgic colors, yellow-green shadows, classic 80s family photo look'
        },
        'fuji-velvia-50': {
            name: 'Fuji Velvia 50',
            style: 'extremely saturated colors, vivid greens and blues, high contrast, dramatic landscape style, slide film look'
        },
        'fuji-superia-400': {
            name: 'Fuji Superia 400',
            style: 'cool tones, cyan shadows, muted colors, Japanese film aesthetic, slightly desaturated, everyday photography'
        },
        'ilford-hp5': {
            name: 'Ilford HP5 Plus',
            style: 'black and white, medium contrast, fine grain, wide tonal range, classic documentary photography look'
        },
        'cinestill-800t': {
            name: 'Cinestill 800T',
            style: 'cinematic tungsten film, orange and teal color palette, halation around lights, night photography, movie-like aesthetic'
        },
        'agfa-vista-200': {
            name: 'Agfa Vista 200',
            style: 'pastel colors, faded vintage look, soft contrast, dreamy aesthetic, light leaks, lo-fi photography'
        },
        'polaroid-600': {
            name: 'Polaroid 600',
            style: 'instant film look, slightly faded colors, soft focus, white frame border, nostalgic polaroid aesthetic, unique color cast'
        }
    },

    // Format aspect ratios
    formats: {
        '35mm': { width: 1024, height: 683, description: '35mm film format' },
        '6x6': { width: 1024, height: 1024, description: 'medium format square' },
        '6x7': { width: 1024, height: 878, description: 'medium format 6x7' },
        '4x5': { width: 1024, height: 819, description: 'large format 4x5' },
        'polaroid': { width: 1024, height: 1024, description: 'polaroid instant film' },
        '110': { width: 1024, height: 768, description: '110 pocket film format' },
        'half-frame': { width: 768, height: 1024, description: 'half frame vertical' },
        'panoramic': { width: 1024, height: 378, description: 'panoramic XPan format' }
    },

    // Filter effects for prompt
    filters: {
        'none': '',
        'warm': 'warm color temperature, orange tint, golden hour lighting',
        'cool': 'cool color temperature, blue tint, shade lighting',
        'sepia': 'sepia toned, vintage brown tint, antique photograph look',
        'green': 'green color cast, forest tones',
        'orange': 'orange color cast, sunset tones',
        'red-bw': 'black and white with red filter, dramatic sky, high contrast',
        'yellow-bw': 'black and white with yellow filter, natural contrast, classic landscape'
    },

    // Grain levels
    grainLevels: {
        'none': '',
        'fine': 'subtle film grain',
        'medium': 'visible film grain texture',
        'heavy': 'heavy film grain, grainy',
        'extreme': 'extremely grainy, lo-fi, noisy'
    },

    // Vignette levels
    vignetteLevels: {
        'none': '',
        'light': 'subtle vignette',
        'medium': 'noticeable vignette darkening corners',
        'strong': 'heavy vignette, dark corners, spotlight effect'
    },

    /**
     * Set the current AI service
     * @param {string} service - 'pollinations' or 'dezgo'
     */
    setService(service) {
        this.currentService = service;
    },

    /**
     * Build the AI prompt from all parameters
     * @param {object} params - All photo parameters
     * @returns {string} Complete prompt
     */
    buildPrompt(params) {
        const {
            location,
            weather,
            film,
            format,
            iso,
            aperture,
            shutter,
            filter,
            grain,
            vignette
        } = params;

        // Get film style
        const filmStyle = this.filmStocks[film]?.style || '';
        const filmName = this.filmStocks[film]?.name || 'analog film';

        // Get format description
        const formatDesc = this.formats[format]?.description || '';

        // Build location/weather context
        const locationContext = location?.city ?
            `photograph taken in ${location.city}, ${location.country}` :
            'outdoor photograph';

        const weatherContext = weather?.condition ?
            `${weather.isDay ? 'daytime' : 'nighttime'}, ${weather.condition.toLowerCase()} weather` :
            '';

        // Build technical settings context
        const technicalContext = `shot at ${aperture}, ${shutter} exposure, ISO ${iso}`;

        // Get effect modifiers
        const filterEffect = this.filters[filter] || '';
        const grainEffect = this.grainLevels[grain] || '';
        const vignetteEffect = this.vignetteLevels[vignette] || '';

        // Combine all parts
        const promptParts = [
            `Beautiful ${formatDesc} photograph`,
            locationContext,
            weatherContext,
            `shot on ${filmName}`,
            filmStyle,
            technicalContext,
            filterEffect,
            grainEffect,
            vignetteEffect,
            'professional photography, high quality, detailed, analog film aesthetic'
        ].filter(part => part.length > 0);

        return promptParts.join(', ');
    },

    /**
     * Generate image using Pollinations.ai
     * @param {string} prompt
     * @param {object} dimensions
     * @returns {Promise<string>} Image URL
     */
    async generateWithPollinations(prompt, dimensions) {
        const { width, height } = dimensions;
        const encodedPrompt = encodeURIComponent(prompt);

        // Pollinations returns an image directly via URL
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true`;

        // Pre-load the image to ensure it's generated
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                resolve(imageUrl);
            };

            img.onerror = () => {
                reject(new Error('Failed to generate image with Pollinations'));
            };

            // Set timeout for generation
            setTimeout(() => {
                reject(new Error('Image generation timed out'));
            }, 120000); // 2 minute timeout

            img.src = imageUrl;
        });
    },

    /**
     * Generate image using Dezgo
     * Note: Dezgo free tier has limitations
     * @param {string} prompt
     * @param {object} dimensions
     * @returns {Promise<string>} Image URL or base64
     */
    async generateWithDezgo(prompt, dimensions) {
        // Dezgo free endpoint (limited)
        const url = 'https://api.dezgo.com/text2image';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    prompt: prompt,
                    width: Math.min(dimensions.width, 512),
                    height: Math.min(dimensions.height, 512),
                    guidance: 7.5,
                    steps: 30
                })
            });

            if (!response.ok) {
                throw new Error('Dezgo API request failed');
            }

            // Dezgo returns image as blob
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Dezgo generation error:', error);
            throw new Error('Failed to generate image with Dezgo. Try Pollinations instead.');
        }
    },

    /**
     * Main generate function
     * @param {object} params - All photo parameters
     * @param {function} onProgress - Progress callback
     * @returns {Promise<string>} Generated image URL
     */
    async generate(params, onProgress = () => {}) {
        onProgress('Building prompt...');

        const prompt = this.buildPrompt(params);
        console.log('Generated prompt:', prompt);

        const format = params.format || '35mm';
        const dimensions = this.formats[format] || this.formats['35mm'];

        onProgress('Generating image...');

        try {
            let imageUrl;

            if (this.currentService === 'pollinations') {
                onProgress('Connecting to Pollinations AI...');
                imageUrl = await this.generateWithPollinations(prompt, dimensions);
            } else if (this.currentService === 'dezgo') {
                onProgress('Connecting to Dezgo AI...');
                imageUrl = await this.generateWithDezgo(prompt, dimensions);
            } else {
                throw new Error('Unknown AI service');
            }

            onProgress('Image ready!');
            return imageUrl;
        } catch (error) {
            console.error('Generation error:', error);
            throw error;
        }
    },

    /**
     * Get the generated prompt for display/debugging
     * @param {object} params
     * @returns {string}
     */
    getPromptPreview(params) {
        return this.buildPrompt(params);
    }
};

// Export for use in other modules
window.AIGenerator = AIGenerator;
