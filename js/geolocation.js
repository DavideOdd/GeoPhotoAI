/**
 * GeoPhotoAI - Geolocation Module
 * Handles location detection and reverse geocoding
 */

const GeoLocation = {
    // Current location data
    data: {
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        countryCode: null,
        region: null,
        accuracy: null
    },

    /**
     * Check if geolocation is supported
     */
    isSupported() {
        return 'geolocation' in navigator;
    },

    /**
     * Get current position
     * @returns {Promise} Resolves with position data
     */
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!this.isSupported()) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.data.latitude = position.coords.latitude;
                    this.data.longitude = position.coords.longitude;
                    this.data.accuracy = position.coords.accuracy;
                    resolve(this.data);
                },
                (error) => {
                    let message;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Location access denied. Please enable location permissions.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            message = 'Location request timed out.';
                            break;
                        default:
                            message = 'An unknown error occurred.';
                    }
                    reject(new Error(message));
                },
                options
            );
        });
    },

    /**
     * Reverse geocode coordinates to get city/country
     * Uses Nominatim (OpenStreetMap) - free, no API key
     * @returns {Promise} Resolves with location details
     */
    async reverseGeocode() {
        if (!this.data.latitude || !this.data.longitude) {
            throw new Error('No coordinates available for reverse geocoding');
        }

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.data.latitude}&lon=${this.data.longitude}&zoom=10&accept-language=en`;

        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'GeoPhotoAI/1.0'
                }
            });

            if (!response.ok) {
                throw new Error('Reverse geocoding failed');
            }

            const data = await response.json();

            // Extract location info from response
            const address = data.address || {};

            this.data.city = address.city ||
                            address.town ||
                            address.village ||
                            address.municipality ||
                            address.county ||
                            'Unknown';

            this.data.country = address.country || 'Unknown';
            this.data.countryCode = address.country_code?.toUpperCase() || '';
            this.data.region = address.state || address.region || '';

            return this.data;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Set fallback values
            this.data.city = 'Unknown Location';
            this.data.country = '';
            return this.data;
        }
    },

    /**
     * Get full location (position + reverse geocoding)
     * @returns {Promise} Resolves with complete location data
     */
    async getFullLocation() {
        await this.getCurrentPosition();
        await this.reverseGeocode();
        return this.data;
    },

    /**
     * Format coordinates for display
     * @returns {string} Formatted coordinates
     */
    formatCoordinates() {
        if (!this.data.latitude || !this.data.longitude) {
            return 'N/A';
        }

        const lat = this.data.latitude.toFixed(4);
        const lon = this.data.longitude.toFixed(4);
        const latDir = this.data.latitude >= 0 ? 'N' : 'S';
        const lonDir = this.data.longitude >= 0 ? 'E' : 'W';

        return `${Math.abs(lat)}°${latDir}, ${Math.abs(lon)}°${lonDir}`;
    },

    /**
     * Get location summary for display
     * @returns {object} Location summary
     */
    getSummary() {
        return {
            city: this.data.city || 'Unknown',
            country: this.data.country || '',
            countryCode: this.data.countryCode || '',
            region: this.data.region || '',
            coordinates: this.formatCoordinates(),
            latitude: this.data.latitude,
            longitude: this.data.longitude
        };
    }
};

// Export for use in other modules
window.GeoLocation = GeoLocation;
