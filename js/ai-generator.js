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

    // Country-specific landmarks and characteristics
    countryCharacteristics: {
        'Italy': {
            landmarks: 'historic architecture, Renaissance buildings, ancient ruins, cobblestone streets, piazzas, fountains, Mediterranean style',
            cities: {
                'Rome': 'Colosseum area, Roman Forum ruins, baroque fountains, ancient temples, Spanish Steps, Tiber river, pine trees',
                'Florence': 'Duomo cathedral, terracotta rooftops, Ponte Vecchio, Tuscan hills, Renaissance palaces, Arno river',
                'Venice': 'canals, gondolas, St Mark Square, Byzantine architecture, bridges, lagoon, colorful buildings',
                'Milan': 'modern architecture, Duomo cathedral, fashion district, trams, Navigli canals',
                'Naples': 'Vesuvius volcano, bay view, narrow streets, laundry lines, historic center',
                'Palermo': 'Arab-Norman architecture, street markets, baroque churches, palm trees, Mediterranean port, Monte Pellegrino'
            }
        },
        'France': {
            landmarks: 'Haussmann buildings, cafes, tree-lined boulevards, ornate ironwork, mansard roofs',
            cities: {
                'Paris': 'Eiffel Tower area, Seine river, Haussmann boulevards, Notre-Dame, Montmartre, zinc rooftops',
                'Nice': 'Promenade des Anglais, Mediterranean coast, pastel buildings, palm trees',
                'Lyon': 'Renaissance old town, two rivers, traboules passages'
            }
        },
        'Japan': {
            landmarks: 'temples, shrines, cherry blossoms, traditional architecture, modern neon, zen gardens',
            cities: {
                'Tokyo': 'neon signs, Shibuya crossing, skyscrapers, temples, cherry blossoms, narrow alleys',
                'Kyoto': 'bamboo forest, golden temple, geisha district, traditional wooden houses, zen gardens',
                'Osaka': 'Dotonbori neon, castle, street food stalls, waterways'
            }
        },
        'United States': {
            landmarks: 'diverse architecture, wide streets, urban skylines',
            cities: {
                'New York': 'Manhattan skyline, Brooklyn Bridge, yellow cabs, brownstones, Central Park, steam vents',
                'Los Angeles': 'palm trees, Hollywood hills, beach boardwalk, Art Deco buildings',
                'San Francisco': 'Golden Gate Bridge, cable cars, Victorian houses, steep hills, fog',
                'Chicago': 'skyscrapers, Lake Michigan, elevated trains, river architecture'
            }
        },
        'United Kingdom': {
            landmarks: 'Georgian architecture, red phone boxes, Victorian buildings, pubs',
            cities: {
                'London': 'Big Ben, Tower Bridge, red buses, Thames river, Georgian townhouses, parks',
                'Edinburgh': 'castle, Royal Mile, Gothic architecture, Arthur Seat, stone buildings'
            }
        },
        'Spain': {
            landmarks: 'Moorish architecture, plazas, terracotta roofs, whitewashed walls',
            cities: {
                'Barcelona': 'Gaudi architecture, Gothic Quarter, Ramblas, Mediterranean beach, modernist buildings',
                'Madrid': 'grand plazas, royal palace, tree-lined paseos, historic center'
            }
        },
        'Germany': {
            landmarks: 'half-timbered houses, Gothic churches, beer gardens, modern architecture',
            cities: {
                'Berlin': 'Brandenburg Gate, modern architecture, historic buildings, graffiti art, riverside',
                'Munich': 'Marienplatz, beer halls, Alps backdrop, baroque churches'
            }
        },
        'Greece': {
            landmarks: 'white buildings, blue domes, ancient ruins, olive trees, Mediterranean coast',
            cities: {
                'Athens': 'Acropolis, Parthenon, ancient agora, neoclassical buildings, Plaka neighborhood',
                'Santorini': 'white houses, blue domed churches, caldera view, sunset cliffs'
            }
        },
        'Netherlands': {
            landmarks: 'canals, bicycles, narrow houses, windmills, tulip fields',
            cities: {
                'Amsterdam': 'canal houses, bridges, bicycles, houseboats, narrow buildings, Jordaan district'
            }
        },
        'Portugal': {
            landmarks: 'azulejo tiles, colorful buildings, trams, coastal cliffs',
            cities: {
                'Lisbon': 'yellow trams, Alfama district, azulejo tiles, hilltop views, Tagus river',
                'Porto': 'Douro river, port wine cellars, colorful Ribeira, Dom Luis bridge'
            }
        }
    },

    /**
     * Set the current AI service
     * @param {string} service - 'pollinations' or 'dezgo'
     */
    setService(service) {
        this.currentService = service;
    },

    /**
     * Get location-specific characteristics for the prompt
     * @param {object} location
     * @returns {string}
     */
    getLocationContext(location) {
        if (!location?.city || !location?.country) {
            return 'scenic urban or natural landscape';
        }

        const country = location.country;
        const city = location.city;

        // Check if we have specific data for this country
        const countryData = this.countryCharacteristics[country];
        if (countryData) {
            // Check for city-specific landmarks
            if (countryData.cities && countryData.cities[city]) {
                return `${city}, ${country}, featuring ${countryData.cities[city]}`;
            }
            // Use country-level characteristics
            return `${city}, ${country}, featuring ${countryData.landmarks}`;
        }

        // Generic description for unknown locations
        return `${city}, ${country}, typical local architecture and landmarks`;
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
            vignette,
            caption,
            season,
            moonPhase,
            timeOfDay
        } = params;

        // Get film style
        const filmStyle = this.filmStocks[film]?.style || '';
        const filmName = this.filmStocks[film]?.name || 'analog film';

        // Get format description
        const formatDesc = this.formats[format]?.description || '';

        // Build location context with specific landmarks
        const locationContext = this.getLocationContext(location);

        // Weather context
        const weatherContext = weather?.condition ?
            `${weather.condition.toLowerCase()} weather` :
            '';

        // Season context
        const seasonContext = season?.description || '';

        // Time of day context
        const timeContext = timeOfDay?.description || '';

        // Moon context (for night scenes)
        let moonContext = '';
        if (timeOfDay?.period === 'night' || timeOfDay?.period === 'dusk') {
            if (moonPhase) {
                if (moonPhase.name === 'Full Moon') {
                    moonContext = 'full moon illuminating the scene, moonlit atmosphere';
                } else if (moonPhase.name === 'New Moon') {
                    moonContext = 'dark night sky, starry sky visible';
                } else {
                    moonContext = `${moonPhase.name.toLowerCase()} in the sky`;
                }
            }
        }

        // Build technical settings context
        const technicalContext = `shot at ${aperture}, ${shutter} exposure, ISO ${iso}`;

        // Get effect modifiers
        const filterEffect = this.filters[filter] || '';
        const grainEffect = this.grainLevels[grain] || '';
        const vignetteEffect = this.vignetteLevels[vignette] || '';

        // User caption (if provided, max 200 chars)
        const userCaption = caption ? caption.substring(0, 200) : '';

        // Landscape and scene constraints - NO portraits, people only in background
        const sceneConstraints = 'landscape photography, cityscape or nature scene, wide angle view, no portraits, no close-up of people, people only as small figures in the distance if any, focus on architecture and environment';

        // Combine all parts
        const promptParts = [
            `Beautiful ${formatDesc} landscape photograph`,
            locationContext,
            userCaption, // User's custom description
            seasonContext,
            timeContext,
            weatherContext,
            moonContext,
            sceneConstraints,
            `shot on ${filmName}`,
            filmStyle,
            technicalContext,
            filterEffect,
            grainEffect,
            vignetteEffect,
            'professional landscape photography, high quality, detailed, analog film aesthetic, authentic location'
        ].filter(part => part && part.length > 0);

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
