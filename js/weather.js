/**
 * GeoPhotoAI - Weather Module
 * Integrates with Open-Meteo API (free, no API key required)
 */

const Weather = {
    // Current weather data
    data: {
        temperature: null,
        weatherCode: null,
        condition: null,
        humidity: null,
        windSpeed: null,
        windDirection: null,
        isDay: true,
        emoji: null
    },

    // WMO Weather interpretation codes
    // https://open-meteo.com/en/docs
    weatherCodes: {
        0: { condition: 'Clear sky', emoji: '☀️', night: '🌙' },
        1: { condition: 'Mainly clear', emoji: '🌤️', night: '🌙' },
        2: { condition: 'Partly cloudy', emoji: '⛅', night: '☁️' },
        3: { condition: 'Overcast', emoji: '☁️', night: '☁️' },
        45: { condition: 'Fog', emoji: '🌫️', night: '🌫️' },
        48: { condition: 'Depositing rime fog', emoji: '🌫️', night: '🌫️' },
        51: { condition: 'Light drizzle', emoji: '🌦️', night: '🌧️' },
        53: { condition: 'Moderate drizzle', emoji: '🌦️', night: '🌧️' },
        55: { condition: 'Dense drizzle', emoji: '🌧️', night: '🌧️' },
        56: { condition: 'Light freezing drizzle', emoji: '🌧️', night: '🌧️' },
        57: { condition: 'Dense freezing drizzle', emoji: '🌧️', night: '🌧️' },
        61: { condition: 'Slight rain', emoji: '🌦️', night: '🌧️' },
        63: { condition: 'Moderate rain', emoji: '🌧️', night: '🌧️' },
        65: { condition: 'Heavy rain', emoji: '🌧️', night: '🌧️' },
        66: { condition: 'Light freezing rain', emoji: '🌨️', night: '🌨️' },
        67: { condition: 'Heavy freezing rain', emoji: '🌨️', night: '🌨️' },
        71: { condition: 'Slight snow', emoji: '🌨️', night: '🌨️' },
        73: { condition: 'Moderate snow', emoji: '❄️', night: '❄️' },
        75: { condition: 'Heavy snow', emoji: '❄️', night: '❄️' },
        77: { condition: 'Snow grains', emoji: '🌨️', night: '🌨️' },
        80: { condition: 'Slight rain showers', emoji: '🌦️', night: '🌧️' },
        81: { condition: 'Moderate rain showers', emoji: '🌧️', night: '🌧️' },
        82: { condition: 'Violent rain showers', emoji: '⛈️', night: '⛈️' },
        85: { condition: 'Slight snow showers', emoji: '🌨️', night: '🌨️' },
        86: { condition: 'Heavy snow showers', emoji: '❄️', night: '❄️' },
        95: { condition: 'Thunderstorm', emoji: '⛈️', night: '⛈️' },
        96: { condition: 'Thunderstorm with slight hail', emoji: '⛈️', night: '⛈️' },
        99: { condition: 'Thunderstorm with heavy hail', emoji: '⛈️', night: '⛈️' }
    },

    /**
     * Fetch current weather from Open-Meteo
     * @param {number} latitude
     * @param {number} longitude
     * @returns {Promise} Resolves with weather data
     */
    async fetchWeather(latitude, longitude) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Weather API request failed');
            }

            const data = await response.json();
            const current = data.current;

            this.data.temperature = Math.round(current.temperature_2m);
            this.data.weatherCode = current.weather_code;
            this.data.humidity = current.relative_humidity_2m;
            this.data.windSpeed = Math.round(current.wind_speed_10m);
            this.data.windDirection = current.wind_direction_10m;
            this.data.isDay = current.is_day === 1;

            // Get condition and emoji from weather code
            const weatherInfo = this.weatherCodes[this.data.weatherCode] || {
                condition: 'Unknown',
                emoji: '🌡️',
                night: '🌡️'
            };

            this.data.condition = weatherInfo.condition;
            this.data.emoji = this.data.isDay ? weatherInfo.emoji : weatherInfo.night;

            return this.data;
        } catch (error) {
            console.error('Weather fetch error:', error);
            throw new Error('Failed to fetch weather data');
        }
    },

    /**
     * Get wind direction as cardinal
     * @param {number} degrees
     * @returns {string} Cardinal direction
     */
    getWindDirection(degrees) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    },

    /**
     * Get weather summary for display
     * @returns {object} Weather summary
     */
    getSummary() {
        return {
            temperature: `${this.data.temperature}°C`,
            condition: this.data.condition || 'Unknown',
            humidity: `${this.data.humidity}%`,
            windSpeed: `${this.data.windSpeed} km/h`,
            windDirection: this.getWindDirection(this.data.windDirection),
            emoji: this.data.emoji || '🌡️',
            isDay: this.data.isDay
        };
    },

    /**
     * Get weather description for AI prompt
     * @returns {string} Weather description
     */
    getPromptDescription() {
        const summary = this.getSummary();
        let description = this.data.condition?.toLowerCase() || 'clear';

        // Add time of day
        const timeOfDay = this.data.isDay ? 'daytime' : 'nighttime';

        // Add temperature context
        let tempContext = '';
        if (this.data.temperature <= 0) {
            tempContext = 'freezing cold';
        } else if (this.data.temperature <= 10) {
            tempContext = 'cold';
        } else if (this.data.temperature <= 20) {
            tempContext = 'mild';
        } else if (this.data.temperature <= 30) {
            tempContext = 'warm';
        } else {
            tempContext = 'hot';
        }

        return `${timeOfDay}, ${description} weather, ${tempContext} temperature`;
    }
};

// Export for use in other modules
window.Weather = Weather;
