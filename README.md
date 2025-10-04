# TripPlanner - Travel Destination Explorer

A modern, responsive web application that helps you explore travel destinations with beautiful photos and real-time weather information.

![TripPlanner Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=TripPlanner+Web+App)

## ✨ Features

- **🔍 Destination Search**: Search for any city or destination worldwide
- **📸 Photo Gallery**: Beautiful, high-quality photos from Unsplash API
- **🌤️ Live Weather**: Real-time weather information with temperature, humidity, wind speed, and visibility
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Fast & Modern**: Built with vanilla HTML, CSS, and JavaScript
- **🎨 Beautiful UI**: Clean, modern interface with smooth animations
- **🛡️ Error Handling**: Comprehensive error handling for API failures and invalid destinations

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser!

### Installation

1. **Download the project files**:

   ```
   TripPlanner/
   ├── index.html
   ├── styles.css
   ├── script.js
   └── README.md
   ```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local development server for better performance

### Using a Local Development Server (Recommended)

For the best experience, serve the files through a local server:

#### Option 1: Python (if installed)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option 2: Node.js (if installed)

```bash
# Install a simple server globally
npm install -g http-server

# Run the server
http-server -p 8000
```

#### Option 3: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

Then visit `http://localhost:8000` in your browser.

## 🎯 How to Use

1. **Open the application** in your web browser
2. **Enter a destination** in the search bar (e.g., "Paris", "Tokyo", "New York")
3. **Click Search** or press Enter
4. **Explore the results**:
   - View current weather conditions
   - Browse beautiful photos of the destination
   - Click on photos to view them on Unsplash

## 🔧 API Configuration

The app uses two external APIs and requires API keys to function:

### Required API Keys

1. **OpenWeatherMap API** - Weather data

   - Get your free key at: https://openweathermap.org/api
   - Rate Limit: 1,000 calls/day (free tier)

2. **Unsplash API** - High-quality travel photos
   - Get your free key at: https://unsplash.com/developers
   - Rate Limit: 50 requests/hour (free tier)

### Setup Instructions

**⚠️ IMPORTANT**: This project uses a secure configuration system to protect API keys.

1. **Copy the configuration template**:

   ```bash
   cp config.js config.local.js
   ```

2. **Add your API keys** to `config.local.js`:

   ```javascript
   const CONFIG = {
     OPENWEATHER_API_KEY: "your_actual_openweather_key_here",
     UNSPLASH_API_KEY: "your_actual_unsplash_key_here",
   };
   ```

3. **Never commit `config.local.js`** - it's already in `.gitignore`

### Security Features

- ✅ API keys are stored in separate configuration files
- ✅ Sensitive files are excluded from version control
- ✅ Template files are safe to commit to GitHub
- ✅ Clear setup instructions for new developers

For detailed setup instructions, see [SETUP.md](SETUP.md).

## 📁 Project Structure

```
TripPlanner/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API calls
├── config.js           # Template configuration (safe to commit)
├── config.local.js     # Your API keys (DO NOT COMMIT)
├── .gitignore          # Git ignore file
├── SETUP.md           # Detailed setup instructions
└── README.md           # This documentation file
```

## 🎨 Customization

### Styling

- Modify `styles.css` to change colors, fonts, and layout
- The app uses CSS custom properties for easy theming
- Responsive breakpoints: 768px (tablet), 480px (mobile)

### Functionality

- Add new features in `script.js`
- Modify API endpoints or add new data sources
- Customize error messages and user feedback

## 🌐 Deployment

### Static Hosting (Recommended)

Deploy to any static hosting service:

#### Netlify

1. Drag and drop the project folder to [Netlify](https://netlify.com)
2. Your app will be live instantly!

#### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### GitHub Pages

1. Push code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch and deploy

#### Other Options

- **Firebase Hosting**: `firebase deploy`
- **AWS S3**: Upload files to S3 bucket with static hosting
- **Surge.sh**: `surge` command line tool

### Server Deployment

For production deployment with a web server:

1. **Apache/Nginx**: Upload files to web root directory
2. **Docker**: Create a simple nginx container
3. **Cloud Services**: AWS, Google Cloud, Azure static hosting

## 🐛 Troubleshooting

### Common Issues

**"Weather data not loading"**

- Check your internet connection
- Verify the OpenWeatherMap API key is valid
- Ensure the destination name is spelled correctly

**"Photos not showing"**

- Check your internet connection
- Verify the Unsplash API key is valid
- Check browser console for CORS errors

**"Search not working"**

- Ensure JavaScript is enabled in your browser
- Check browser console for error messages
- Try refreshing the page

### Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 📱 Mobile Support

The app is fully responsive and optimized for:

- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🔒 Security Notes

- ✅ API keys are now stored in separate configuration files
- ✅ Sensitive files are excluded from version control via `.gitignore`
- ✅ Template files are safe to commit to GitHub
- ⚠️ For production, consider using a backend proxy for additional security
- ✅ The current setup is suitable for development and small-scale deployment

## 🤝 Contributing

Feel free to contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data API
- **Unsplash** for beautiful travel photos
- **Font Awesome** for icons
- **Google Fonts** for typography

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all files are in the same directory
4. Verify your internet connection

---

**Happy Traveling! ✈️🌍**

Made with ❤️ for travelers and developers.
