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
        generatedImageUrl: null,
        aiService: 'pollinations',
        timestamp: null
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
            generate: document.getElementById('step-generate'),
            email: document.getElementById('step-email'),
            confirm: document.getElementById('step-confirm')
        };

        // Buttons
        this.elements.buttons = {
            start: document.getElementById('btn-start'),
            toSettings: document.getElementById('btn-to-settings'),
            backToLocation: document.getElementById('btn-back-to-location'),
            capture: document.getElementById('btn-capture'),
            regenerate: document.getElementById('btn-regenerate'),
            toEmail: document.getElementById('btn-to-email'),
            backToGenerate: document.getElementById('btn-back-to-generate'),
            sendEmail: document.getElementById('btn-send-email'),
            newPhoto: document.getElementById('btn-new-photo'),
            closeError: document.getElementById('btn-close-error')
        };

        // Location elements
        this.elements.location = {
            city: document.getElementById('location-city'),
            country: document.getElementById('location-country'),
            coords: document.getElementById('location-coords')
        };

        // Weather elements
        this.elements.weather = {
            icon: document.getElementById('weather-icon'),
            temp: document.getElementById('weather-temp'),
            condition: document.getElementById('weather-condition'),
            humidity: document.getElementById('weather-humidity'),
            wind: document.getElementById('weather-wind')
        };

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
            status: document.getElementById('developing-status'),
            photoPaper: document.getElementById('photo-paper'),
            preview: document.getElementById('generated-preview'),
            image: document.getElementById('generated-image')
        };

        // Email elements
        this.elements.email = {
            previewImage: document.getElementById('email-preview-image'),
            inputEmail: document.getElementById('input-email'),
            inputMessage: document.getElementById('input-message'),
            checkboxCopy: document.getElementById('checkbox-copy'),
            inputMyEmail: document.getElementById('input-my-email'),
            photoDataGrid: document.getElementById('photo-data-grid')
        };

        // Confirmation elements
        this.elements.confirm = {
            details: document.getElementById('confirm-details')
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
        this.elements.buttons.toEmail.addEventListener('click', () => this.goToEmail());
        this.elements.buttons.backToGenerate.addEventListener('click', () => this.goToStep('generate'));
        this.elements.buttons.sendEmail.addEventListener('click', () => this.sendEmail());
        this.elements.buttons.newPhoto.addEventListener('click', () => this.resetApp());
        this.elements.buttons.closeError.addEventListener('click', () => this.hideError());

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

        // Email copy checkbox
        this.elements.email.checkboxCopy.addEventListener('change', (e) => {
            this.elements.email.inputMyEmail.style.display = e.target.checked ? 'block' : 'none';
        });
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
        AIGenerator.setService(this.state.aiService);
    },

    /**
     * Capture photo - trigger AI generation
     */
    async capturePhoto() {
        this.goToStep('generate');

        // Reset UI
        this.elements.aiService.preview.style.display = 'none';
        this.elements.buttons.regenerate.style.display = 'none';
        this.elements.buttons.toEmail.style.display = 'none';
        document.querySelector('.developing-animation').style.display = 'flex';

        // Set timestamp
        this.state.timestamp = Date.now();

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
            vignette: this.state.settings.vignette
        };

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
            this.elements.buttons.toEmail.style.display = 'inline-flex';

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
     * Go to email step
     */
    goToEmail() {
        // Set preview image
        this.elements.email.previewImage.src = this.state.generatedImageUrl;

        // Populate photo data
        this.populatePhotoData();

        this.goToStep('email');
    },

    /**
     * Populate photo data grid
     */
    populatePhotoData() {
        const data = [
            { label: 'Location', value: `${this.state.location.city}, ${this.state.location.country}` },
            { label: 'Weather', value: `${this.state.weather.condition}` },
            { label: 'Temperature', value: this.state.weather.temperature },
            { label: 'Film', value: this.state.settings.filmName },
            { label: 'Format', value: this.state.settings.format },
            { label: 'Aperture', value: this.state.settings.aperture },
            { label: 'Shutter', value: this.state.settings.shutter },
            { label: 'ISO', value: this.state.settings.iso },
            { label: 'Filter', value: this.state.settings.filter },
            { label: 'Grain', value: this.state.settings.grain }
        ];

        this.elements.email.photoDataGrid.innerHTML = data.map(item =>
            `<span>${item.label}: <strong>${item.value}</strong></span>`
        ).join('');
    },

    /**
     * Send email
     */
    async sendEmail() {
        const toEmail = this.elements.email.inputEmail.value.trim();
        const message = this.elements.email.inputMessage.value.trim();
        const sendCopy = this.elements.email.checkboxCopy.checked;
        const myEmail = this.elements.email.inputMyEmail.value.trim();

        // Validate
        if (!toEmail) {
            this.showError('Please enter a recipient email address.');
            return;
        }

        if (!this.isValidEmail(toEmail)) {
            this.showError('Please enter a valid email address.');
            return;
        }

        if (sendCopy && !myEmail) {
            this.showError('Please enter your email address for the copy.');
            return;
        }

        if (sendCopy && !this.isValidEmail(myEmail)) {
            this.showError('Please enter a valid email address for the copy.');
            return;
        }

        // Check EmailJS configuration
        if (!EmailService.isConfigured()) {
            this.showError('EmailJS is not configured. Please set up config.js with your EmailJS credentials. See README.md for instructions.');
            return;
        }

        this.showLoading('Sending your photo...');

        try {
            const photoData = {
                location: this.state.location,
                weather: this.state.weather,
                settings: this.state.settings,
                timestamp: this.state.timestamp
            };

            await EmailService.sendEmails({
                toEmail: toEmail,
                message: message,
                imageUrl: this.state.generatedImageUrl,
                photoData: photoData
            }, sendCopy ? myEmail : null);

            this.hideLoading();

            // Show confirmation
            this.elements.confirm.details.innerHTML = `
                <p>Sent to: <strong>${toEmail}</strong></p>
                ${sendCopy ? `<p>Copy sent to: <strong>${myEmail}</strong></p>` : ''}
                <p>Location: <strong>${this.state.location.city}, ${this.state.location.country}</strong></p>
                <p>Film: <strong>${this.state.settings.filmName}</strong></p>
            `;

            this.goToStep('confirm');

        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    },

    /**
     * Validate email format
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Reset app to start
     */
    resetApp() {
        // Clear form
        this.elements.email.inputEmail.value = '';
        this.elements.email.inputMessage.value = '';
        this.elements.email.checkboxCopy.checked = false;
        this.elements.email.inputMyEmail.value = '';
        this.elements.email.inputMyEmail.style.display = 'none';

        // Reset generated image
        this.state.generatedImageUrl = null;

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
