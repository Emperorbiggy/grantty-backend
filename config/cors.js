module.exports = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: ['Authorization', 'Content-Type'],
  credentials: false, 
  maxAge: 90
}
