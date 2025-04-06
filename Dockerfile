# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only the necessary files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port AdonisJS listens on
EXPOSE 3333

# Start the server
CMD ["node", "server.js"]
