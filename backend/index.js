
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// Removed: const fetch = require('node-fetch').default;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Weather API route
app.get('/weather', async (req, res) => {
    const { destination } = req.query;
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    try {
        const { default: fetch } = await import('node-fetch'); // Dynamic import
        console.log('OpenWeatherMap API URL being requested:', weatherUrl); // Debugging: Weather URL
        const response = await fetch(weatherUrl);
        const data = await response.json();
        console.log('OpenWeatherMap API response data:', data); // Debugging: Weather response
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ message: 'Failed to fetch weather data.' });
    }
});

// Unsplash API route
app.get('/photos', async (req, res) => {
    const { destination, type } = req.query;
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    // More specific search queries based on type and location
    let searchQuery;
    
    // Check if it's an Indian state and adjust search accordingly
    const indianStates = ['andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal'];
    const isIndianState = indianStates.includes(destination.toLowerCase());
    
    if (isIndianState) {
        // For Indian states, include both state name and India
        if (type === 'attractions') {
            searchQuery = `"${destination}" "India" tourist attractions landmarks monuments temples`;
        } else {
            searchQuery = `"${destination}" "India" cityscape architecture street life culture`;
        }
    } else {
        // For other destinations, use the original approach
        if (type === 'attractions') {
            searchQuery = `"${destination}" tourist attractions landmarks monuments city`;
        } else {
            searchQuery = `"${destination}" cityscape architecture street life culture city`;
        }
    }
    
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=30&orientation=landscape&order_by=relevant`;

    try {
        const { default: fetch } = await import('node-fetch'); // Dynamic import
        const response = await fetch(unsplashUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching photos data:', error);
        res.status(500).json({ message: 'Failed to fetch photos data.' });
    }
});

// New Destination Info API route (Wikipedia)
app.get('/destination-info', async (req, res) => {
    const { destination } = req.query;
    console.log('Wikipedia query received in backend:', destination); // Debugging: Initial query
    
    let wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination)}`;
    console.log('Initial Wikipedia API URL being requested:', wikipediaUrl); // Debugging: Direct lookup URL

    try {
        const { default: fetch } = await import('node-fetch'); // Dynamic import
        let response = await fetch(wikipediaUrl);
        let data = await response.json();

        // If direct summary fails, try a broader search
        if (response.status === 404 || (data.type && data.type === 'Internal error')) {
            console.log(`Direct Wikipedia summary for "${destination}" failed (404). Attempting broader search.`);
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(destination)}&format=json&prop=info&inprop=url`;
            console.log('Wikipedia search URL:', searchUrl); // Debugging: Broader search URL
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if (searchData.query && searchData.query.search.length > 0) {
                // Take the first search result
                const topResultTitle = searchData.query.search[0].title;
                wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topResultTitle)}`;
                console.log('Wikipedia API URL after search result:', wikipediaUrl); // Debugging: URL for summary after search
                response = await fetch(wikipediaUrl);
                data = await response.json();
            } else {
                console.log('Wikipedia search returned no relevant results for:', destination); // Debugging: No search results
                data = { extract: 'No specific history found.', title: 'Not found.' }; // Fallback
            }
        }

        console.log('Final Wikipedia API response data:', data); // Debugging: Final data sent to frontend
        res.json(data);
    } catch (error) {
        console.error('Error fetching destination info:', error);
        res.status(500).json({ message: 'Failed to fetch destination information.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
