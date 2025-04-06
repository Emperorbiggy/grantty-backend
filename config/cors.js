module.exports = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  maxAge: 90
}
