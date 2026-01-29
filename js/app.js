/**
 * GeoPhotoAI - Main Application
 * Coordinates all modules and manages the app flow
 */

const App = {
    // Current step
    currentStep: 'welcome',

    // App state
    state: {
        location: null,
        weather: null,
        settings: {
            film: 'kodak-portra-400',
            filmName: 'Kodak Portra 400',
            format: '35mm',
            iso: '200',
            aperture: 'f/2.8',
            shutter: '1/125s',
            filter: 'none',
            grain: 'fine',
            vignette: 'light'
        },
        caption: '',
        season: null,
        moonPhase: null,
        timeOfDay: null,
        generatedImageUrl: null,
        generatedPrompt: null,
        aiService: 'nano-banana-fast',
        timestamp: null,
        captureTime: null
    },

    // DOM Elements cache
    elements: {},

    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initSettings();
        console.log('GeoPhotoAI initialized');
    },

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        // Steps
        this.elements.steps = {
            welcome: document.getElementById('step-welcome'),
            location: document.getElementById('step-location'),
            settings: document.getElementById('step-settings'),
            generate: document.getElementById('step-generate')
        };

        // Buttons
        this.elements.buttons = {
            start: document.getElementById('btn-start'),
            toSettings: document.getElementById('btn-to-settings'),
            backToLocation: document.getElementById('btn-back-to-location'),
            capture: document.getElementById('btn-capture'),
            regenerate: document.getElementById('btn-regenerate'),
            download: document.getElementById('btn-download'),
            downloadInfo: document.getElementById('btn-download-info'),
            downloadPrompt: document.getElementById('btn-download-prompt'),
            newPhoto: document.getElementById('btn-new-photo'),
            closeError: document.getElementById('btn-close-error')
        };

        // Location elements
        this.elements.location = {
            city: document.getElementById('location-city'),
            country: document.getElementById('location-country'),
            coords: document.getElementById('location-coords')
        };

        // Time elements
        this.elements.currentTime = document.getElementById('current-time');
        this.elements.currentDate = document.getElementById('current-date');

        // Weather elements
        this.elements.weather = {
            icon: document.getElementById('weather-icon'),
            temp: document.getElementById('weather-temp'),
            condition: document.getElementById('weather-condition'),
            humidity: document.getElementById('weather-humidity'),
            wind: document.getElementById('weather-wind')
        };

        // Moon and season elements
        this.elements.moonCard = document.getElementById('moon-card');
        this.elements.moonIcon = document.getElementById('moon-icon');
        this.elements.moonPhase = document.getElementById('moon-phase');
        this.elements.seasonInfo = document.getElementById('season-info');

        // Caption elements
        this.elements.captionInput = document.getElementById('input-caption');
        this.elements.captionCount = document.getElementById('caption-count');

        // Settings elements
        this.elements.settings = {
            tabs: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.tab-content'),
            filmItems: document.querySelectorAll('.film-item'),
            formatItems: document.querySelectorAll('.format-item'),
            iso: document.getElementById('select-iso'),
            aperture: document.getElementById('select-aperture'),
            shutter: document.getElementById('select-shutter'),
            filter: document.getElementById('select-filter'),
            grain: document.getElementById('select-grain'),
            vignette: document.getElementById('select-vignette')
        };

        // AI service elements
        this.elements.aiService = {
            buttons: document.querySelectorAll('.service-btn'),
            note: document.getElementById('service-note'),
            puterLoginBtn: document.getElementById('btn-puter-login'),
            status: document.getElementById('developing-status'),
            photoPaper: document.getElementById('photo-paper'),
            preview: document.getElementById('generated-preview'),
            image: document.getElementById('generated-image'),
            photoInfo: document.getElementById('photo-info')
        };

        // Modal & Loading
        this.elements.errorModal = document.getElementById('error-modal');
        this.elements.errorMessage = document.getElementById('error-message');
        this.elements.loadingOverlay = document.getElementById('loading-overlay');
        this.elements.loadingMessage = document.getElementById('loading-message');
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Navigation buttons
        this.elements.buttons.start.addEventListener('click', () => this.startApp());
        this.elements.buttons.toSettings.addEventListener('click', () => this.goToStep('settings'));
        this.elements.buttons.backToLocation.addEventListener('click', () => this.goToStep('location'));
        this.elements.buttons.capture.addEventListener('click', () => this.capturePhoto());
        this.elements.buttons.regenerate.addEventListener('click', () => this.regeneratePhoto());
        this.elements.buttons.download.addEventListener('click', () => this.downloadPhoto());
        this.elements.buttons.downloadInfo.addEventListener('click', () => this.downloadInfo());
        this.elements.buttons.downloadPrompt.addEventListener('click', () => this.downloadPrompt());
        this.elements.buttons.newPhoto.addEventListener('click', () => this.resetApp());
        this.elements.buttons.closeError.addEventListener('click', () => this.hideError());

        // Caption input
        this.elements.captionInput.addEventListener('input', (e) => {
            this.state.caption = e.target.value;
            this.elements.captionCount.textContent = e.target.value.length;
        });

        // Settings tabs
        this.elements.settings.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Film selection
        this.elements.settings.filmItems.forEach(item => {
            item.addEventListener('click', () => this.selectFilm(item));
        });

        // Format selection
        this.elements.settings.formatItems.forEach(item => {
            item.addEventListener('click', () => this.selectFormat(item));
        });

        // Exposure settings
        this.elements.settings.iso.addEventListener('change', (e) => {
            this.state.settings.iso = e.target.value;
        });
        this.elements.settings.aperture.addEventListener('change', (e) => {
            this.state.settings.aperture = e.target.value;
        });
        this.elements.settings.shutter.addEventListener('change', (e) => {
            this.state.settings.shutter = e.target.value;
        });

        // Effects settings
        this.elements.settings.filter.addEventListener('change', (e) => {
            this.state.settings.filter = e.target.value;
        });
        this.elements.settings.grain.addEventListener('change', (e) => {
            this.state.settings.grain = e.target.value;
        });
        this.elements.settings.vignette.addEventListener('change', (e) => {
            this.state.settings.vignette = e.target.value;
        });

        // AI Service selection
        this.elements.aiService.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.selectAIService(btn));
        });

        // Puter login button
        if (this.elements.aiService.puterLoginBtn) {
            this.elements.aiService.puterLoginBtn.addEventListener('click', () => this.loginPuter());
        }
    },

    /**
     * Initialize default settings
     */
    initSettings() {
        // Select default film
        const defaultFilm = document.querySelector('[data-film="kodak-portra-400"]');
        if (defaultFilm) defaultFilm.classList.add('selected');

        // Select default format
        const defaultFormat = document.querySelector('[data-format="35mm"]');
        if (defaultFormat) defaultFormat.classList.add('selected');

        // Initialize AI service from config
        const defaultService = window.CONFIG?.DEFAULT_AI_SERVICE || 'nano-banana-fast';
        this.state.aiService = defaultService;
        AIGenerator.setService(defaultService);

        // Update service note
        this.updateServiceNote(defaultService);
    },

    /**
     * Navigate to a step
     * @param {string} stepName
     */
    goToStep(stepName) {
        // Hide all steps
        Object.values(this.elements.steps).forEach(step => {
            step.classList.remove('active');
        });

        // Show target step
        const targetStep = this.elements.steps[stepName];
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepName;
        }

        // Scroll to top
        window.scrollTo(0, 0);
    },

    /**
     * Format time for display
     * @param {Date} date
     * @returns {string}
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    },

    /**
     * Format date for display
     * @param {Date} date
     * @returns {string}
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    /**
     * Format full datetime
     * @param {Date} date
     * @returns {string}
     */
    formatDateTime(date) {
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    },

    /**
     * Calculate moon phase
     * @param {Date} date
     * @returns {object} Moon phase info
     */
    calculateMoonPhase(date) {
        // Synodic month (days between new moons)
        const synodicMonth = 29.53058867;

        // Known new moon date (Jan 6, 2000)
        const knownNewMoon = new Date(2000, 0, 6, 18, 14);

        // Days since known new moon
        const daysSince = (date - knownNewMoon) / (1000 * 60 * 60 * 24);

        // Current phase (0-1)
        const phase = (daysSince % synodicMonth) / synodicMonth;

        // Phase name and emoji
        let name, emoji;
        if (phase < 0.0625) {
            name = 'New Moon';
            emoji = '🌑';
        } else if (phase < 0.1875) {
            name = 'Waxing Crescent';
            emoji = '🌒';
        } else if (phase < 0.3125) {
            name = 'First Quarter';
            emoji = '🌓';
        } else if (phase < 0.4375) {
            name = 'Waxing Gibbous';
            emoji = '🌔';
        } else if (phase < 0.5625) {
            name = 'Full Moon';
            emoji = '🌕';
        } else if (phase < 0.6875) {
            name = 'Waning Gibbous';
            emoji = '🌖';
        } else if (phase < 0.8125) {
            name = 'Last Quarter';
            emoji = '🌗';
        } else if (phase < 0.9375) {
            name = 'Waning Crescent';
            emoji = '🌘';
        } else {
            name = 'New Moon';
            emoji = '🌑';
        }

        return { name, emoji, phase };
    },

    /**
     * Calculate season based on date and hemisphere
     * @param {Date} date
     * @param {number} latitude
     * @returns {object} Season info
     */
    calculateSeason(date, latitude) {
        const month = date.getMonth();
        const day = date.getDate();
        const isNorthern = latitude >= 0;

        // Approximate season boundaries
        let season;
        if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 21)) {
            season = isNorthern ? 'Spring' : 'Autumn';
        } else if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 22)) {
            season = isNorthern ? 'Summer' : 'Winter';
        } else if ((month === 8 && day >= 22) || month === 9 || month === 10 || (month === 11 && day < 21)) {
            season = isNorthern ? 'Autumn' : 'Spring';
        } else {
            season = isNorthern ? 'Winter' : 'Summer';
        }

        // Season characteristics for prompt
        const characteristics = {
            'Spring': 'spring season, blooming flowers, fresh green leaves, mild weather',
            'Summer': 'summer season, bright sunlight, lush vegetation, warm atmosphere',
            'Autumn': 'autumn season, golden and red foliage, falling leaves, warm colors',
            'Winter': 'winter season, bare trees, cold atmosphere, muted colors'
        };

        return { name: season, description: characteristics[season] };
    },

    /**
     * Calculate time of day context
     * @param {Date} date
     * @param {boolean} isDay
     * @returns {object} Time of day info
     */
    calculateTimeOfDay(date, isDay) {
        const hour = date.getHours();

        let period, description;

        if (hour >= 5 && hour < 7) {
            period = 'dawn';
            description = 'early morning dawn, soft pink and orange sky, golden hour beginning';
        } else if (hour >= 7 && hour < 10) {
            period = 'morning';
            description = 'morning light, soft shadows, fresh atmosphere';
        } else if (hour >= 10 && hour < 12) {
            period = 'late morning';
            description = 'late morning, bright daylight, clear visibility';
        } else if (hour >= 12 && hour < 14) {
            period = 'midday';
            description = 'midday sun, harsh shadows, bright exposure';
        } else if (hour >= 14 && hour < 17) {
            period = 'afternoon';
            description = 'afternoon light, warm tones, long shadows beginning';
        } else if (hour >= 17 && hour < 19) {
            period = 'golden hour';
            description = 'golden hour, warm golden light, long dramatic shadows, magic hour';
        } else if (hour >= 19 && hour < 21) {
            period = 'dusk';
            description = 'dusk, blue hour, twilight sky, city lights beginning';
        } else if (hour >= 21 || hour < 5) {
            period = 'night';
            description = isDay ? 'evening atmosphere' : 'nighttime, dark sky, city lights, artificial illumination';
        }

        return { period, description };
    },

    /**
     * Start the app - get location and weather
     */
    async startApp() {
        this.showLoading('Detecting your location...');

        try {
            // Get location
            await GeoLocation.getFullLocation();
            this.state.location = GeoLocation.getSummary();

            // Update UI
            this.elements.location.city.textContent = this.state.location.city;
            this.elements.location.country.textContent = this.state.location.country;
            this.elements.location.coords.textContent = this.state.location.coordinates;

            // Get weather
            this.showLoading('Fetching weather data...');
            await Weather.fetchWeather(this.state.location.latitude, this.state.location.longitude);
            this.state.weather = Weather.getSummary();

            // Update weather UI
            this.elements.weather.icon.querySelector('.weather-emoji').textContent = this.state.weather.emoji;
            this.elements.weather.temp.textContent = this.state.weather.temperature;
            this.elements.weather.condition.textContent = this.state.weather.condition;
            this.elements.weather.humidity.textContent = `Humidity: ${this.state.weather.humidity}`;
            this.elements.weather.wind.textContent = `Wind: ${this.state.weather.windSpeed}`;

            // Get current time
            const now = new Date();
            this.elements.currentTime.textContent = this.formatTime(now);
            this.elements.currentDate.textContent = this.formatDate(now);

            // Calculate moon phase
            this.state.moonPhase = this.calculateMoonPhase(now);
            this.elements.moonIcon.textContent = this.state.moonPhase.emoji;
            this.elements.moonPhase.textContent = this.state.moonPhase.name;

            // Calculate season
            this.state.season = this.calculateSeason(now, this.state.location.latitude);
            this.elements.seasonInfo.textContent = this.state.season.name;

            // Calculate time of day
            this.state.timeOfDay = this.calculateTimeOfDay(now, this.state.weather.isDay);

            // Enable continue button
            this.elements.buttons.toSettings.disabled = false;

            this.hideLoading();
            this.goToStep('location');

        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    },

    /**
     * Switch settings tab
     * @param {string} tabName
     */
    switchTab(tabName) {
        // Update tab buttons
        this.elements.settings.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        this.elements.settings.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    },

    /**
     * Select a film stock
     * @param {HTMLElement} item
     */
    selectFilm(item) {
        // Remove selection from all
        this.elements.settings.filmItems.forEach(i => i.classList.remove('selected'));

        // Add selection to clicked
        item.classList.add('selected');

        // Update state
        this.state.settings.film = item.dataset.film;
        this.state.settings.filmName = item.querySelector('.film-name').textContent;
    },

    /**
     * Select a format
     * @param {HTMLElement} item
     */
    selectFormat(item) {
        // Remove selection from all
        this.elements.settings.formatItems.forEach(i => i.classList.remove('selected'));

        // Add selection to clicked
        item.classList.add('selected');

        // Update state
        this.state.settings.format = item.dataset.format;
    },

    /**
     * Select AI service
     * @param {HTMLElement} btn
     */
    selectAIService(btn) {
        this.elements.aiService.buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.aiService = btn.dataset.service;

        console.log('AI Service selected:', this.state.aiService);

        AIGenerator.setService(this.state.aiService);

        // Update service note
        this.updateServiceNote(this.state.aiService);
    },

    /**
     * Update service note based on selected service
     * @param {string} service
     */
    updateServiceNote(service) {
        const noteEl = this.elements.aiService.note;
        const loginBtn = this.elements.aiService.puterLoginBtn;
        if (!noteEl) return;

        const hasGoogleKey = window.CONFIG?.GOOGLE_API_KEY && window.CONFIG.GOOGLE_API_KEY.length > 0;
        const isNanoBanana = service.startsWith('nano-banana');

        const notes = {
            'nano-banana-fast': 'Gemini 2.5 Flash - Fast',
            'nano-banana-pro': 'Gemini 2.0 Flash - Quality',
            'pollinations': 'Free, no login',
            'dezgo': 'Free, max 512px'
        };

        noteEl.textContent = notes[service] || '';
        noteEl.classList.toggle('highlight', isNanoBanana);

        // Show/hide Puter login button
        if (loginBtn) {
            const showLogin = isNanoBanana && !hasGoogleKey;
            loginBtn.style.display = showLogin ? 'inline-block' : 'none';
        }
    },

    /**
     * Login to Puter for Nano Banana access
     */
    async loginPuter() {
        if (typeof puter === 'undefined') {
            this.showError('Puter.js not loaded. Please refresh the page.');
            return;
        }

        try {
            this.showLoading('Connecting to Puter...');

            // Check if already authenticated
            const isAuthenticated = puter.auth?.isSignedIn?.() || false;

            if (!isAuthenticated) {
                // Trigger Puter sign-in
                await puter.auth.signIn();
            }

            this.hideLoading();

            // Update button text to show logged in
            if (this.elements.aiService.puterLoginBtn) {
                this.elements.aiService.puterLoginBtn.textContent = 'Logged In';
                this.elements.aiService.puterLoginBtn.disabled = true;
            }

        } catch (error) {
            this.hideLoading();
            console.error('Puter login error:', error);
            this.showError('Failed to login to Puter: ' + error.message);
        }
    },

    /**
     * Capture photo - trigger AI generation
     */
    async capturePhoto() {
        this.goToStep('generate');

        // Reset UI
        this.elements.aiService.preview.style.display = 'none';
        this.elements.buttons.regenerate.style.display = 'none';
        this.elements.buttons.download.style.display = 'none';
        this.elements.buttons.downloadInfo.style.display = 'none';
        this.elements.buttons.downloadPrompt.style.display = 'none';
        this.elements.buttons.newPhoto.style.display = 'none';
        document.querySelector('.developing-animation').style.display = 'flex';

        // Set timestamp and capture time
        this.state.timestamp = Date.now();
        this.state.captureTime = new Date();

        // Build parameters
        const params = {
            location: this.state.location,
            weather: this.state.weather,
            film: this.state.settings.film,
            format: this.state.settings.format,
            iso: this.state.settings.iso,
            aperture: this.state.settings.aperture,
            shutter: this.state.settings.shutter,
            filter: this.state.settings.filter,
            grain: this.state.settings.grain,
            vignette: this.state.settings.vignette,
            caption: this.state.caption,
            season: this.state.season,
            moonPhase: this.state.moonPhase,
            timeOfDay: this.state.timeOfDay
        };

        // Save the generated prompt
        this.state.generatedPrompt = AIGenerator.getPromptPreview(params);

        console.log('Generating with service:', this.state.aiService, 'AIGenerator.currentService:', AIGenerator.currentService);

        try {
            // Generate image
            const imageUrl = await AIGenerator.generate(params, (status) => {
                this.elements.aiService.status.textContent = status;
            });

            this.state.generatedImageUrl = imageUrl;

            // Show result
            this.elements.aiService.image.src = imageUrl;
            document.querySelector('.developing-animation').style.display = 'none';
            this.elements.aiService.preview.style.display = 'flex';
            this.elements.buttons.regenerate.style.display = 'inline-flex';
            this.elements.buttons.download.style.display = 'inline-flex';
            this.elements.buttons.downloadInfo.style.display = 'inline-flex';
            this.elements.buttons.downloadPrompt.style.display = 'inline-flex';
            this.elements.buttons.newPhoto.style.display = 'inline-flex';

            // Show photo info with time
            const captureTimeStr = this.formatTime(this.state.captureTime);
            this.elements.aiService.photoInfo.innerHTML = `
                <span>${this.state.location.city}, ${this.state.location.country}</span>
                <span>${captureTimeStr}</span>
                <span>${this.state.settings.filmName}</span>
                <span>${this.state.season.name} | ${this.state.timeOfDay.period}</span>
            `;

        } catch (error) {
            this.showError(error.message);
        }
    },

    /**
     * Regenerate photo with same settings
     */
    regeneratePhoto() {
        this.capturePhoto();
    },

    /**
     * Download the generated photo
     */
    async downloadPhoto() {
        if (!this.state.generatedImageUrl) return;

        try {
            this.showLoading('Preparing download...');

            // Fetch the image
            const response = await fetch(this.state.generatedImageUrl);
            const blob = await response.blob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Generate filename
            const timestamp = new Date().toISOString().slice(0, 10);
            const timeStr = this.formatTime(this.state.captureTime).replace(':', '-');
            const city = this.state.location.city.replace(/\s+/g, '-').toLowerCase();
            link.download = `geophotoai-${city}-${timestamp}-${timeStr}.jpg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            this.hideLoading();

        } catch (error) {
            this.hideLoading();
            this.showError('Failed to download image. Please try again.');
        }
    },

    /**
     * Generate full info text
     * @returns {string}
     */
    generateInfoText() {
        const captureDateTime = this.formatDateTime(this.state.captureTime);

        return `
================================================================================
                           GEOPHOTOAI - PHOTO DATA
================================================================================

CAPTURE INFORMATION
-------------------
Date & Time: ${captureDateTime}
Location: ${this.state.location.city}, ${this.state.location.country}
Coordinates: ${this.state.location.coordinates}
Season: ${this.state.season.name}
Time of Day: ${this.state.timeOfDay.period}
Moon Phase: ${this.state.moonPhase.name}

WEATHER CONDITIONS
------------------
Condition: ${this.state.weather.condition}
Temperature: ${this.state.weather.temperature}
Humidity: ${this.state.weather.humidity}
Wind: ${this.state.weather.windSpeed}
Day/Night: ${this.state.weather.isDay ? 'Day' : 'Night'}

CAMERA SETTINGS
---------------
Film: ${this.state.settings.filmName}
Format: ${this.state.settings.format}
Aperture: ${this.state.settings.aperture}
Shutter Speed: ${this.state.settings.shutter}
ISO: ${this.state.settings.iso}
Filter: ${this.state.settings.filter}
Grain: ${this.state.settings.grain}
Vignette: ${this.state.settings.vignette}

USER CAPTION
------------
${this.state.caption || '(No caption provided)'}

AI SERVICE
----------
Service: ${this.state.aiService}

GENERATED PROMPT
----------------
${this.state.generatedPrompt}

================================================================================
                        Generated with GeoPhotoAI v${CONFIG.VERSION}
================================================================================
`.trim();
    },

    /**
     * Download photo info as text file
     */
    downloadInfo() {
        const infoText = this.generateInfoText();

        const blob = new Blob([infoText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const timestamp = new Date().toISOString().slice(0, 10);
        const timeStr = this.formatTime(this.state.captureTime).replace(':', '-');
        const city = this.state.location.city.replace(/\s+/g, '-').toLowerCase();
        link.download = `geophotoai-${city}-${timestamp}-${timeStr}-info.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Download prompt as text file
     */
    downloadPrompt() {
        if (!this.state.generatedPrompt) return;

        const promptText = `GEOPHOTOAI - AI PROMPT
Generated: ${this.formatDateTime(this.state.captureTime)}
Location: ${this.state.location.city}, ${this.state.location.country}

================================================================================
PROMPT
================================================================================

${this.state.generatedPrompt}

================================================================================
`;

        const blob = new Blob([promptText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const timestamp = new Date().toISOString().slice(0, 10);
        const timeStr = this.formatTime(this.state.captureTime).replace(':', '-');
        const city = this.state.location.city.replace(/\s+/g, '-').toLowerCase();
        link.download = `geophotoai-${city}-${timestamp}-${timeStr}-prompt.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Reset app to start
     */
    resetApp() {
        // Clear caption
        this.elements.captionInput.value = '';
        this.elements.captionCount.textContent = '0';
        this.state.caption = '';

        // Reset generated data
        this.state.generatedImageUrl = null;
        this.state.generatedPrompt = null;

        // Go to welcome
        this.goToStep('welcome');
    },

    /**
     * Show loading overlay
     * @param {string} message
     */
    showLoading(message = 'Loading...') {
        this.elements.loadingMessage.textContent = message;
        this.elements.loadingOverlay.classList.add('active');
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.elements.loadingOverlay.classList.remove('active');
    },

    /**
     * Show error modal
     * @param {string} message
     */
    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorModal.classList.add('active');
    },

    /**
     * Hide error modal
     */
    hideError() {
        this.elements.errorModal.classList.remove('active');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for debugging
window.App = App;
