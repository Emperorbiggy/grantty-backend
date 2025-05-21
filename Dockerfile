# Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create the SQLite DB folder in the image and set permissions
RUN mkdir -p database && touch database/adonis.sqlite && chmod -R 777 database

EXPOSE 3333

CMD node ace migration:run --force && node server.js
