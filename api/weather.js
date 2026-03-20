const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(weather);
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
};