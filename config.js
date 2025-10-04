// Configuration template file for TripPlanner App
// This file contains placeholder values and is safe to commit to GitHub
// Copy this file to config.local.js and add your actual API keys

// Only set CONFIG if it doesn't already exist (allows config.local.js to override)
if (typeof CONFIG === 'undefined') {
    window.CONFIG = {
        // Get your OpenWeatherMap API key from: https://openweathermap.org/api
        OPENWEATHER_API_KEY: 'YOUR_OPENWEATHER_API_KEY_HERE',
        
        // Get your Unsplash API key from: https://unsplash.com/developers
        UNSPLASH_API_KEY: 'YOUR_UNSPLASH_API_KEY_HERE'
    };
}
