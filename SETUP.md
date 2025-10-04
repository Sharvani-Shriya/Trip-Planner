# TripPlanner Setup Instructions

## Getting Started

This project requires API keys from two services to function properly. Follow these steps to set up your environment.

## Required API Keys

### 1. OpenWeatherMap API Key

- Visit: https://openweathermap.org/api
- Sign up for a free account
- Generate an API key
- Copy the API key

### 2. Unsplash API Key

- Visit: https://unsplash.com/developers
- Sign up for a free account
- Create a new application
- Copy the Access Key

## Configuration

### Option 1: Using config.local.js (Recommended)

1. Copy `config.js` to `config.local.js`
2. Open `config.local.js` in a text editor
3. Replace the placeholder values with your actual API keys:
   ```javascript
   const CONFIG = {
     OPENWEATHER_API_KEY: "your_actual_openweather_key_here",
     UNSPLASH_API_KEY: "your_actual_unsplash_key_here",
   };
   ```

### Option 2: Using Environment Variables

1. Create a `.env` file in the project root
2. Add your API keys:
   ```
   OPENWEATHER_API_KEY=your_actual_openweather_key_here
   UNSPLASH_API_KEY=your_actual_unsplash_key_here
   ```

## Security Notes

- **NEVER** commit `config.local.js` or `.env` files to version control
- These files are already included in `.gitignore` to prevent accidental commits
- The `config.js` file is safe to commit as it only contains placeholder values

## Running the Application

1. Open `index.html` in a web browser
2. The application should load and be ready to use
3. If you see API errors, double-check your configuration

## Troubleshooting

### API Key Errors

- Ensure your API keys are correctly copied (no extra spaces or characters)
- Verify that your API keys are active and have the correct permissions
- Check the browser console for specific error messages

### CORS Issues

- Some APIs may have CORS restrictions when running locally
- Consider using a local development server instead of opening the HTML file directly
- You can use Python's built-in server: `python -m http.server 8000`

## File Structure

```
TripPlanner/
├── index.html          # Main HTML file
├── script.js           # Main JavaScript file
├── styles.css          # CSS styles
├── config.js           # Template configuration (safe to commit)
├── config.local.js     # Your actual API keys (DO NOT COMMIT)
├── .gitignore          # Git ignore file
└── SETUP.md           # This file
```

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your API keys are correct
3. Ensure you have an active internet connection
4. Check if the API services are operational
