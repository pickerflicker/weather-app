# Weather App

A simple web application that fetches current weather by US ZIP code. The frontend is a responsive HTML/JS form, the backend is a Node.js/Express server that proxies requests to the free [wttr.in](https://wttr.in) weather API.

## Features

- Clean, mobile‑friendly UI with real‑time weather display
- Backend API endpoint `/api/weather?zip=...` that validates ZIP and fetches weather
- Error handling and user‑friendly messages
- Health check endpoint (`/api/health`)
- Ready for deployment (Docker, VPS, cloud services)

## Project Structure

```
weather-app/
├── server.js                 # Express server (backend)
├── package.json              # Dependencies and scripts
├── .gitignore
├── README.md
├── public/                   # Frontend static files
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Dockerfile                # Container definition
└── docker-compose.yml        # Optional compose for multi‑service
```

## Quick Start

### Prerequisites

- Node.js 16+ (or Docker)
- npm (or yarn)

### Local Development

1. Clone the repository (or copy the files).

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   (Requires `nodemon` globally or as dev dependency.)

   Or start directly:
   ```bash
   node server.js
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Usage

### Health Check
`GET /api/health`
```json
{"status":"ok","timestamp":"2025-03-20T22:13:45.123Z"}
```

### Weather by ZIP
`GET /api/weather?zip=90210`

**Successful response (200):**
```json
{
  "location": "Beverly Hills, California, United States of America",
  "temperature": "68°F",
  "condition": "Partly cloudy",
  "feelsLike": "70°F",
  "humidity": "65%",
  "windSpeed": "8 mph",
  "windDirection": "NW",
  "observationTime": "2025-03-20 10:45 AM",
  "zip": "90210"
}
```

**Error responses:**
- `400` – Missing or invalid ZIP parameter
- `500` – Weather API failure

## Deployment Options

### 1. Docker (Recommended)

A `Dockerfile` is included. Build and run:

```bash
docker build -t weather-app .
docker run -p 3000:3000 weather-app
```

For production, use a process manager (PM2) inside the container or orchestrate with `docker-compose`.

### 2. Traditional VPS (Ubuntu/Debian)

1. Install Node.js and npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

2. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url> /var/www/weather-app
   cd /var/www/weather-app
   npm install --production
   ```

3. Set up a systemd service (`/etc/systemd/system/weather.service`):
   ```ini
   [Unit]
   Description=Weather App
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/weather-app
   ExecStart=/usr/bin/node server.js
   Restart=on-failure
   Environment=NODE_ENV=production
   Environment=PORT=3000

   [Install]
   WantedBy=multi-user.target
   ```

4. Start and enable:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start weather
   sudo systemctl enable weather
   ```

5. Use a reverse proxy (nginx/Apache) to expose on port 80/443.

### 3. Cloud Platforms

#### Heroku
```bash
heroku create
git push heroku main
```

#### Railway / Render
Connect your Git repository; the platform automatically detects the Node.js app and runs `npm start`.

#### AWS Elastic Beanstalk
Package as a ZIP with `package.json` and `server.js`, upload via console or CLI.

## Environment Variables

- `PORT` – Port the server listens on (default: 3000)
- `NODE_ENV` – Set to `production` for optimized logging

## Version Control

The repository is already initialized with Git. To commit and push:

```bash
git add .
git commit -m "Initial commit: weather app"
git remote add origin <your-repo-url>
git push -u origin main
```

## Future Enhancements

- Add support for international postal codes
- Cache weather responses (Redis)
- Add weather forecasts (multi‑day)
- Unit and integration tests
- CI/CD pipeline (GitHub Actions)

## License

MIT