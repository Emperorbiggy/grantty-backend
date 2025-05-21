# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the AdonisJS port
EXPOSE 3333

# Run migration and start the server
CMD node ace migration:run && node server.js
