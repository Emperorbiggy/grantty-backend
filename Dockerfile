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

# Ensure the SQLite database file exists
RUN mkdir -p database && touch database/adonis.sqlite

# Set environment to development
ENV NODE_ENV=development

# Expose port
EXPOSE 3333

# Run migration with force and start server
CMD ["sh", "-c", "node ace migration:run --force && node server.js"]