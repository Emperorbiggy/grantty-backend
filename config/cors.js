module.exports = {
  origin: [
  'http://192.168.56.1:8080',               // Local dev
  'https://grantty.com'  // Deployed frontend
],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  maxAge: 90
}
