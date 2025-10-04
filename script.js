// TripPlanner Web App - JavaScript
// This file handles all the interactive functionality, API calls, and DOM manipulation

// API Configuration - Load from external config files
let API_KEYS = {};

// Function to load API keys from configuration
function loadAPIKeys() {
    console.log('Loading API keys...');
    console.log('CONFIG object available:', typeof CONFIG !== 'undefined');
    console.log('window.CONFIG available:', typeof window.CONFIG !== 'undefined');
    
    // Check if CONFIG object is available (from config files)
    if (typeof CONFIG !== 'undefined' && CONFIG.OPENWEATHER_API_KEY && CONFIG.UNSPLASH_API_KEY) {
        API_KEYS = {
            OPENWEATHER: CONFIG.OPENWEATHER_API_KEY,
            UNSPLASH: CONFIG.UNSPLASH_API_KEY
        };
        console.log('API keys loaded from CONFIG:', API_KEYS);
        console.log('OpenWeather key:', API_KEYS.OPENWEATHER);
        console.log('Unsplash key:', API_KEYS.UNSPLASH);
    } else if (typeof window.CONFIG !== 'undefined' && window.CONFIG.OPENWEATHER_API_KEY && window.CONFIG.UNSPLASH_API_KEY) {
        API_KEYS = {
            OPENWEATHER: window.CONFIG.OPENWEATHER_API_KEY,
            UNSPLASH: window.CONFIG.UNSPLASH_API_KEY
        };
        console.log('API keys loaded from window.CONFIG:', API_KEYS);
    } else {
        console.error('CONFIG object not found or incomplete!');
        console.error('CONFIG:', typeof CONFIG !== 'undefined' ? CONFIG : 'undefined');
        console.error('window.CONFIG:', typeof window.CONFIG !== 'undefined' ? window.CONFIG : 'undefined');
        console.error('Please ensure config.local.js exists and contains your API keys.');
        console.error('See SETUP.md for instructions.');
        
        // Set placeholder values that will cause clear error messages
        API_KEYS = {
            OPENWEATHER: 'NOT_CONFIGURED',
            UNSPLASH: 'NOT_CONFIGURED'
        };
    }
}

// DOM Elements
const elements = {
    destinationInput: document.getElementById('destinationInput'),
    searchBtn: document.getElementById('searchBtn'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    resultsSection: document.getElementById('resultsSection'),
    welcomeState: document.getElementById('welcomeState'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    destinationName: document.getElementById('destinationName'),
    destinationDescription: document.getElementById('destinationDescription'),
    weatherIcon: document.getElementById('weatherIcon'),
    temperature: document.getElementById('temperature'),
    weatherCondition: document.getElementById('weatherCondition'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    visibility: document.getElementById('visibility'),
    photoGallery: document.getElementById('photoGallery')
};

// State management
let currentDestination = '';
let isLoading = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load API keys first
    loadAPIKeys();
    
    // Initialize the app
    initializeApp();
});

/**
 * Initialize the application
 * Sets up event listeners and shows the welcome state
 */
function initializeApp() {
    // Add event listeners
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.destinationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    elements.retryBtn.addEventListener('click', handleRetry);
    
    // Show welcome state initially
    showWelcomeState();
    
    // Add input validation
    elements.destinationInput.addEventListener('input', function() {
        if (this.value.trim()) {
            elements.searchBtn.disabled = false;
        } else {
            elements.searchBtn.disabled = true;
        }
    });
    
    // Debug: Log API keys status
    console.log('Current API keys status:', API_KEYS);
    console.log('OpenWeather key configured:', !!API_KEYS.OPENWEATHER);
    console.log('Unsplash key configured:', !!API_KEYS.UNSPLASH);
}

/**
 * Handle search button click or Enter key press
 */
async function handleSearch() {
    const destination = elements.destinationInput.value.trim();
    
    if (!destination) {
        showError('Please enter a destination to search for.');
        return;
    }
    
    if (isLoading) return;
    
    currentDestination = destination;
    showLoadingState();
    
    try {
        // Fetch weather and photos data in parallel
        const [weatherData, photosData] = await Promise.all([
            fetchWeatherData(destination),
            fetchPhotosData(destination)
        ]);
        
        displayResults(weatherData, photosData);
        
        } catch (error) {
        console.error('Search error:', error);
        showError('Failed to fetch data. Please check your internet connection and try again.');
    }
}

/**
 * Handle retry button click
 */
function handleRetry() {
    if (currentDestination) {
        handleSearch();
    } else {
        showWelcomeState();
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    isLoading = true;
    hideAllStates();
    elements.loadingState.classList.remove('hidden');
    elements.loadingState.classList.add('fade-in');
}

/**
 * Show error state with custom message
 * @param {string} message - Error message to display
 */
function showError(message) {
    isLoading = false;
    hideAllStates();
    elements.errorMessage.textContent = message;
    elements.errorState.classList.remove('hidden');
    elements.errorState.classList.add('fade-in');
}

/**
 * Show welcome state
 */
function showWelcomeState() {
    isLoading = false;
    hideAllStates();
    elements.welcomeState.classList.remove('hidden');
    elements.welcomeState.classList.add('fade-in');
}

/**
 * Show results with weather and photos data
 * @param {Object} weatherData - Weather information from OpenWeatherMap API
 * @param {Object} photosData - Photos data from Unsplash API
 */
function displayResults(weatherData, photosData) {
    isLoading = false;
    hideAllStates();
    
    // Update destination info
    elements.destinationName.textContent = currentDestination;
    elements.destinationDescription.textContent = `Discover the beauty and culture of ${currentDestination}. Plan your perfect trip with current weather conditions and stunning photography.`;
    
    // Update weather information
    updateWeatherDisplay(weatherData);
    
    // Update photo gallery
    updatePhotoGallery(photosData);
    
    // Show results
    elements.resultsSection.classList.remove('hidden');
    elements.resultsSection.classList.add('fade-in');
    
    // Scroll to results
    elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Update weather display with fetched data
 * @param {Object} weatherData - Weather data from OpenWeatherMap API
 */
function updateWeatherDisplay(weatherData) {
    if (!weatherData || !weatherData.main) {
        console.error('Invalid weather data:', weatherData);
        return;
    }
    
    // Update temperature (convert from Kelvin to Celsius)
    const tempCelsius = Math.round(weatherData.main.temp - 273.15);
    elements.temperature.textContent = `${tempCelsius}°C`;
    
    // Update weather condition
    elements.weatherCondition.textContent = weatherData.weather[0].description;
    
    // Update weather icon
    const iconCode = weatherData.weather[0].icon;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    elements.weatherIcon.alt = weatherData.weather[0].description;
    
    // Update weather details
    elements.humidity.textContent = `${weatherData.main.humidity}%`;
    elements.windSpeed.textContent = `${weatherData.wind.speed} m/s`;
    
    // Convert visibility from meters to kilometers
    const visibilityKm = (weatherData.visibility / 1000).toFixed(1);
    elements.visibility.textContent = `${visibilityKm} km`;
}

/**
 * Update photo gallery with fetched images
 * @param {Object} photosData - Photos data from Unsplash API
 */
function updatePhotoGallery(photosData) {
    if (!photosData || !photosData.results || photosData.results.length === 0) {
        console.error('No photos data available');
        elements.photoGallery.innerHTML = '<p>No photos available for this destination.</p>';
        return;
    }
    
    // Clear existing photos
    elements.photoGallery.innerHTML = '';
    
    // Display up to 6 photos
    const photosToShow = photosData.results.slice(0, 6);
    
    photosToShow.forEach(photo => {
        const photoItem = createPhotoElement(photo);
        elements.photoGallery.appendChild(photoItem);
    });
}

/**
 * Create a photo element for the gallery
 * @param {Object} photo - Photo object from Unsplash API
 * @returns {HTMLElement} - Photo element
 */
function createPhotoElement(photo) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    
    // Extract location name from photo description or tags
    const getLocationName = (photo) => {
        // Try to get location from description first
        if (photo.alt_description) {
            const desc = photo.alt_description.toLowerCase();
            
            // Look for landmark patterns with more flexible matching
            const landmarkPatterns = [
                // Famous international landmarks
                { pattern: /taj mahal/i, name: 'Taj Mahal' },
                { pattern: /eiffel tower/i, name: 'Eiffel Tower' },
                { pattern: /big ben/i, name: 'Big Ben' },
                { pattern: /colosseum/i, name: 'Colosseum' },
                { pattern: /sydney opera house/i, name: 'Sydney Opera House' },
                { pattern: /statue of liberty/i, name: 'Statue of Liberty' },
                { pattern: /golden gate bridge/i, name: 'Golden Gate Bridge' },
                { pattern: /machu picchu/i, name: 'Machu Picchu' },
                { pattern: /christ the redeemer/i, name: 'Christ the Redeemer' },
                { pattern: /petra/i, name: 'Petra' },
                { pattern: /angkor wat/i, name: 'Angkor Wat' },
                { pattern: /mount fuji/i, name: 'Mount Fuji' },
                { pattern: /santorini/i, name: 'Santorini' },
                { pattern: /bali/i, name: 'Bali' },
                { pattern: /dubai/i, name: 'Dubai' },
                { pattern: /venice/i, name: 'Venice' },
                { pattern: /prague/i, name: 'Prague' },
                { pattern: /barcelona/i, name: 'Barcelona' },
                { pattern: /amsterdam/i, name: 'Amsterdam' },
                { pattern: /istanbul/i, name: 'Istanbul' },
                { pattern: /cairo/i, name: 'Cairo' },
                { pattern: /moscow/i, name: 'Moscow' },
                { pattern: /tokyo/i, name: 'Tokyo' },
                { pattern: /kyoto/i, name: 'Kyoto' },
                { pattern: /osaka/i, name: 'Osaka' },
                { pattern: /seoul/i, name: 'Seoul' },
                { pattern: /bangkok/i, name: 'Bangkok' },
                { pattern: /singapore/i, name: 'Singapore' },
                { pattern: /hong kong/i, name: 'Hong Kong' },
                { pattern: /shanghai/i, name: 'Shanghai' },
                { pattern: /beijing/i, name: 'Beijing' },
                
                // Indian landmarks and places
                { pattern: /red fort/i, name: 'Red Fort' },
                { pattern: /qutub minar/i, name: 'Qutub Minar' },
                { pattern: /lotus temple/i, name: 'Lotus Temple' },
                { pattern: /india gate/i, name: 'India Gate' },
                { pattern: /gateway of india/i, name: 'Gateway of India' },
                { pattern: /marine drive/i, name: 'Marine Drive' },
                { pattern: /amber fort/i, name: 'Amber Fort' },
                { pattern: /hawa mahal/i, name: 'Hawa Mahal' },
                { pattern: /city palace/i, name: 'City Palace' },
                { pattern: /jantar mantar/i, name: 'Jantar Mantar' },
                { pattern: /mysore palace/i, name: 'Mysore Palace' },
                { pattern: /ellora caves/i, name: 'Ellora Caves' },
                { pattern: /ajanta caves/i, name: 'Ajanta Caves' },
                { pattern: /hampi/i, name: 'Hampi' },
                { pattern: /juhu beach/i, name: 'Juhu Beach' },
                { pattern: /bandra/i, name: 'Bandra' },
                { pattern: /andheri/i, name: 'Andheri' },
                { pattern: /powai/i, name: 'Powai' },
                { pattern: /malad/i, name: 'Malad' },
                { pattern: /borivali/i, name: 'Borivali' },
                { pattern: /thane/i, name: 'Thane' },
                { pattern: /navi mumbai/i, name: 'Navi Mumbai' },
                { pattern: /pune/i, name: 'Pune' },
                { pattern: /nashik/i, name: 'Nashik' },
                { pattern: /aurangabad/i, name: 'Aurangabad' },
                { pattern: /ellora/i, name: 'Ellora' },
                { pattern: /ajanta/i, name: 'Ajanta' },
                { pattern: /mysore/i, name: 'Mysore' },
                { pattern: /bangalore/i, name: 'Bangalore' },
                { pattern: /chennai/i, name: 'Chennai' },
                { pattern: /hyderabad/i, name: 'Hyderabad' },
                { pattern: /kolkata/i, name: 'Kolkata' },
                { pattern: /ahmedabad/i, name: 'Ahmedabad' },
                { pattern: /jaipur/i, name: 'Jaipur' },
                { pattern: /goa/i, name: 'Goa' },
                { pattern: /kerala/i, name: 'Kerala' },
                { pattern: /rajasthan/i, name: 'Rajasthan' },
                { pattern: /kashmir/i, name: 'Kashmir' },
                { pattern: /ladakh/i, name: 'Ladakh' },
                { pattern: /himachal/i, name: 'Himachal Pradesh' },
                { pattern: /manali/i, name: 'Manali' },
                { pattern: /shimla/i, name: 'Shimla' },
                { pattern: /darjeeling/i, name: 'Darjeeling' },
                { pattern: /ooty/i, name: 'Ooty' },
                { pattern: /munnar/i, name: 'Munnar' },
                { pattern: /coorg/i, name: 'Coorg' },
                { pattern: /mumbai/i, name: 'Mumbai' },
                { pattern: /delhi/i, name: 'Delhi' },
                
                // Generic landmark patterns
                { pattern: /palace/i, name: 'Palace' },
                { pattern: /temple/i, name: 'Temple' },
                { pattern: /fort/i, name: 'Fort' },
                { pattern: /tower/i, name: 'Tower' },
                { pattern: /bridge/i, name: 'Bridge' },
                { pattern: /church/i, name: 'Church' },
                { pattern: /mosque/i, name: 'Mosque' },
                { pattern: /cathedral/i, name: 'Cathedral' },
                { pattern: /museum/i, name: 'Museum' },
                { pattern: /garden/i, name: 'Garden' },
                { pattern: /park/i, name: 'Park' },
                { pattern: /beach/i, name: 'Beach' },
                { pattern: /mountain/i, name: 'Mountain' },
                { pattern: /lake/i, name: 'Lake' },
                { pattern: /river/i, name: 'River' },
                { pattern: /valley/i, name: 'Valley' },
                { pattern: /island/i, name: 'Island' },
                { pattern: /monument/i, name: 'Monument' },
                { pattern: /landmark/i, name: 'Landmark' }
            ];
            
            // Check for exact landmark matches first
            for (let landmark of landmarkPatterns) {
                if (landmark.pattern.test(desc)) {
                    return landmark.name;
                }
            }
            
            // Try to extract any capitalized words that might be place names
            const words = desc.split(/\s+/);
            const capitalizedWords = words.filter(word => 
                word.length > 2 && 
                /^[A-Z]/.test(word) && 
                !['The', 'And', 'Or', 'But', 'For', 'Nor', 'Yet', 'So', 'With', 'From', 'Into', 'During', 'Including', 'Until', 'Against', 'Among', 'Throughout', 'Despite', 'Towards', 'Upon', 'Concerning', 'To', 'Of', 'At', 'By', 'For', 'In', 'On', 'With', 'Without', 'Under', 'Over', 'Above', 'Below', 'Between', 'Among', 'Through', 'During', 'Before', 'After', 'Since', 'Until', 'While', 'Because', 'Although', 'If', 'Unless', 'When', 'Where', 'Why', 'How', 'What', 'Which', 'Who', 'Whom', 'Whose', 'This', 'That', 'These', 'Those'].includes(word)
            );
            
            if (capitalizedWords.length > 0) {
                // Return the first meaningful capitalized word
                return capitalizedWords[0];
            }
        }
        
        // Try to get location from tags
                        if (photo.tags && photo.tags.length > 0) {
            // Look for location-specific tags
            const locationTags = photo.tags.filter(tag => 
                tag.type === 'landing_page' || 
                tag.type === 'search' ||
                tag.title.toLowerCase().includes('landmark') ||
                tag.title.toLowerCase().includes('monument') ||
                tag.title.toLowerCase().includes('palace') ||
                tag.title.toLowerCase().includes('temple') ||
                tag.title.toLowerCase().includes('fort') ||
                tag.title.toLowerCase().includes('tower') ||
                tag.title.toLowerCase().includes('bridge') ||
                tag.title.toLowerCase().includes('church') ||
                tag.title.toLowerCase().includes('mosque') ||
                tag.title.toLowerCase().includes('cathedral') ||
                tag.title.toLowerCase().includes('museum') ||
                tag.title.toLowerCase().includes('garden') ||
                tag.title.toLowerCase().includes('park') ||
                tag.title.toLowerCase().includes('beach') ||
                tag.title.toLowerCase().includes('mountain') ||
                tag.title.toLowerCase().includes('lake') ||
                tag.title.toLowerCase().includes('river') ||
                tag.title.toLowerCase().includes('valley') ||
                tag.title.toLowerCase().includes('island') ||
                tag.title.toLowerCase().includes('city') ||
                tag.title.toLowerCase().includes('town') ||
                tag.title.toLowerCase().includes('village')
            );
            
            if (locationTags.length > 0) {
                return locationTags[0].title;
            }
        }
        
        // Fallback to current destination
        return currentDestination;
    };
    
    const locationName = getLocationName(photo);
    
    photoItem.innerHTML = `
        <img src="${photo.urls.regular}" alt="${photo.alt_description || 'Travel photo'}" loading="lazy">
        <div class="photo-overlay">
            <div class="photo-author">${locationName}</div>
        </div>
    `;
    
    // Add click handler to open full-size image
    photoItem.addEventListener('click', () => {
        window.open(photo.links.html, '_blank');
    });
    
    return photoItem;
}

/**
 * Hide all state elements
 */
function hideAllStates() {
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.resultsSection.classList.add('hidden');
    elements.welcomeState.classList.add('hidden');
}

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {string} destination - Destination name
 * @returns {Promise<Object>} - Weather data
 */
async function fetchWeatherData(destination) {
    // Check if API key is properly configured
    if (!API_KEYS.OPENWEATHER || API_KEYS.OPENWEATHER === 'NOT_CONFIGURED') {
        throw new Error('OpenWeatherMap API key not configured. Please check your config.local.js file.');
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destination)}&appid=${API_KEYS.OPENWEATHER}`;
    console.log('Fetching weather from:', url);
    console.log('API Key being used:', API_KEYS.OPENWEATHER);
    console.log('API Key length:', API_KEYS.OPENWEATHER ? API_KEYS.OPENWEATHER.length : 'undefined');
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key in config.local.js');
            } else {
                throw new Error(`Weather service error: ${response.status}`);
            }
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Weather API error:', error);
        throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
}

/**
 * Fetch photos data from Unsplash API
 * @param {string} destination - Destination name
 * @returns {Promise<Object>} - Photos data
 */
async function fetchPhotosData(destination) {
    // Check if API key is properly configured
    if (!API_KEYS.UNSPLASH || API_KEYS.UNSPLASH === 'NOT_CONFIGURED') {
        throw new Error('Unsplash API key not configured. Please check your config.local.js file.');
    }
    
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&per_page=6&orientation=landscape&client_id=${API_KEYS.UNSPLASH}`;
    console.log('Fetching photos from:', url);
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your Unsplash API key in config.local.js');
            } else {
                throw new Error(`Photo service error: ${response.status}`);
            }
        }
        
            const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Unsplash API error:', error);
        throw new Error(`Failed to fetch photos: ${error.message}`);
    }
}

/**
 * Utility function to debounce search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add search suggestions functionality
const searchSuggestions = [
    'Paris', 'Tokyo', 'London', 'Rome', 'Barcelona', 'New York',
    'Sydney', 'Dubai', 'Amsterdam', 'Prague', 'Bangkok', 'Istanbul',
    'San Francisco', 'Vancouver', 'Copenhagen', 'Vienna', 'Edinburgh'
];

// Add autocomplete functionality
elements.destinationInput.addEventListener('input', debounce(function() {
    const value = this.value.toLowerCase();
    if (value.length > 1) {
        // You could implement autocomplete suggestions here
        // For now, we'll just enable/disable the search button
        elements.searchBtn.disabled = value.trim().length === 0;
    }
}, 300));

// Add keyboard navigation support
elements.destinationInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        this.blur();
        showWelcomeState();
    }
});

// Add error handling for network issues
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    showError('You appear to be offline. Please check your internet connection.');
});

// Add loading state management
function setLoadingState(loading) {
    isLoading = loading;
    elements.searchBtn.disabled = loading;
    elements.searchBtn.innerHTML = loading 
        ? '<i class="fas fa-spinner fa-spin"></i> Searching...' 
        : '<i class="fas fa-search"></i> Search';
}

// Update the handleSearch function to use the new loading state
const originalHandleSearch = handleSearch;
handleSearch = async function() {
    const destination = elements.destinationInput.value.trim();
    
    if (!destination) {
        showError('Please enter a destination to search for.');
        return;
    }
    
    if (isLoading) return;
    
    currentDestination = destination;
    setLoadingState(true);
    showLoadingState();
    
    try {
        const [weatherData, photosData] = await Promise.all([
            fetchWeatherData(destination),
            fetchPhotosData(destination)
        ]);
        
        displayResults(weatherData, photosData);
        
    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'Failed to fetch data. Please check your internet connection and try again.');
    } finally {
        setLoadingState(false);
    }
};

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add image lazy loading optimization
function addLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', addLazyLoading);

console.log('TripPlanner app initialized successfully!');