module.exports = {
  origin: (origin) => origin || '*',  // fallback for no origin (like Postman)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  maxAge: 90
}
