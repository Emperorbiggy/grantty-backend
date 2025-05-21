# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose AdonisJS port
EXPOSE 3333

# Run migrations and start the server
CMD npx adonis migration:run && node server.js
