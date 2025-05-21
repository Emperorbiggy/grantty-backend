# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Compile TypeScript
RUN node ace build

# Expose port Adonis listens on
EXPOSE 3333

# Run migrations and start the compiled server
CMD node build/ace.js migration:run && node build/server.js
