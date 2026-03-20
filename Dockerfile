# Use official Node.js LTS as base
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Define health check (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Run the app
CMD [ "node", "server.js" ]