const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Weather endpoint
app.get('/api/weather', async (req, res) => {
  const { zip } = req.query;
  
  if (!zip) {
    return res.status(400).json({ error: 'Missing zip parameter' });
  }

  // Validate zip format (US zip: 5 digits)
  const zipRegex = /^\d{5}$/;
  if (!zipRegex.test(zip)) {
    return res.status(400).json({ error: 'Invalid zip format (must be 5 digits)' });
  }

  try {
    // Fetch from wttr.in (free weather API)
    const response = await fetch(`https://wttr.in/${zip}?format=j1`);
    if (!response.ok) {
      throw new Error(`Weather API responded with status ${response.status}`);
    }
    const data = await response.json();
    
    // Extract relevant info
    const current = data.current_condition[0];
    const location = data.nearest_area[0];
    
    const weather = {
      location: `${location.areaName[0].value}, ${location.region[0].value}, ${location.country[0].value}`,
      temperature: current.temp_F + '°F',
      condition: current.weatherDesc[0].value,
      feelsLike: current.FeelsLikeF + '°F',
      humidity: current.humidity + '%',
      windSpeed: current.windspeedMiles + ' mph',
      windDirection: current.winddir16Point,
      observationTime: current.localObsDateTime,
      zip: zip
    };
    
    res.json(weather);
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
});

// Serve frontend for any other route (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});