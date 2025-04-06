module.exports = {
  origin: true,  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  maxAge: 90
}
