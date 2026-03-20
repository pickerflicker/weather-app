document.addEventListener('DOMContentLoaded', function() {
  const zipInput = document.getElementById('zip');
  const fetchBtn = document.getElementById('fetchBtn');
  const loading = document.getElementById('loading');
  const resultCard = document.getElementById('resultCard');
  const errorCard = document.getElementById('errorCard');
  const retryBtn = document.getElementById('retryBtn');

  // Result elements
  const locationEl = document.getElementById('location');
  const observationTimeEl = document.getElementById('observationTime');
  const temperatureEl = document.getElementById('temperature');
  const conditionEl = document.getElementById('condition');
  const feelsLikeEl = document.getElementById('feelsLike');
  const humidityEl = document.getElementById('humidity');
  const windSpeedEl = document.getElementById('windSpeed');
  const windDirectionEl = document.getElementById('windDirection');
  const zipDisplayEl = document.getElementById('zipDisplay');
  const errorMessageEl = document.getElementById('errorMessage');

  // Validate zip input
  zipInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0,5);
  });

  // Fetch weather
  fetchBtn.addEventListener('click', fetchWeather);
  zipInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') fetchWeather();
  });

  retryBtn.addEventListener('click', function() {
    errorCard.style.display = 'none';
    zipInput.focus();
  });

  async function fetchWeather() {
    const zip = zipInput.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      showError('Please enter a valid 5‑digit US ZIP code.');
      return;
    }

    // Show loading, hide other cards
    loading.style.display = 'block';
    resultCard.style.display = 'none';
    errorCard.style.display = 'none';

    try {
      const response = await fetch(`/api/weather?zip=${zip}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      // Update UI with weather data
      locationEl.textContent = data.location;
      observationTimeEl.textContent = `Observed: ${formatObservationTime(data.observationTime)}`;
      temperatureEl.textContent = data.temperature;
      conditionEl.textContent = data.condition;
      feelsLikeEl.textContent = data.feelsLike;
      humidityEl.textContent = data.humidity;
      windSpeedEl.textContent = data.windSpeed;
      windDirectionEl.textContent = data.windDirection;
      zipDisplayEl.textContent = zip;

      // Show result
      loading.style.display = 'none';
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      console.error('Fetch error:', error);
      showError(`Could not fetch weather for ZIP ${zip}. ${error.message}. Please try again.`);
    }
  }

  function showError(msg) {
    loading.style.display = 'none';
    errorMessageEl.textContent = msg;
    errorCard.style.display = 'block';
    errorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function formatObservationTime(timeStr) {
    if (!timeStr) return '—';
    // wttr.in returns something like "2025-03-20 10:45 AM"
    // Just return as is, or format if needed
    return timeStr.replace('localObsDateTime', '');
  }

  // Pre‑fill with a sample ZIP on first load (optional)
  if (!zipInput.value) {
    zipInput.value = '90210';
  }
});