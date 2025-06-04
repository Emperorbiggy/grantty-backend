'use strict'

const Route = use('Route')

// ===========================
// 🔓 Public Routes
// ===========================

Route.post('/signup', 'AuthController.store')
Route.get('/ping', () => 'pong')
Route.post('/login', 'AuthController.login')
Route.post('/verify-otp', 'AuthController.verifyOTP')
Route.get('/users', 'AuthController.fetchAllUsers')
Route.post('/resend-otp', 'AuthController.resendOtp')

Route.post('/newsletter', 'NewsletterController.subscribe')



// Test route for checking server status
Route.get('/test', ({ response }) => {
  return response.json({ message: 'Server is running' })
})
Route.post('/signup-test', ({ response }) => {
  return response.json({ message: 'signup test success' })
})


// ===========================
// 🔐 Auth-Protected Routes
// ===========================

Route.group(() => {
  // User profile management
  Route.get('/profile', 'AuthController.show')
  Route.put('/profile', 'AuthController.update')
  Route.post('/logout', 'AuthController.logout')

  // User-specific data
  Route.get('/user/startups', 'StartupController.getByUserId')
  Route.get('/user/payments', 'PaymentController.getUserPayments')
  Route.get('/payment', 'PaymentController.getUserPayments')

  // Create startup (protected)
  Route.post('/startups', 'StartupController.create')
}).middleware(['auth'])

// ===========================
// 🌐 Publicly Accessible Resources
// ===========================

// Startups
Route.get('/startups', 'StartupController.getAll')
Route.get('/startups/:id', 'StartupController.getById')

// Payments (some routes public, others protected)
Route.post('/payments/initialize', 'PaymentController.initialize')
Route.get('/payments/verify/:reference', 'PaymentController.verify')

Route.get('/payments', 'PaymentController.all')
Route.get('/payments/:id', 'PaymentController.getById')
Route.get('/payments/startup/:startup_id', 'PaymentController.getByStartupId')

// Webhook or callback for payment processor (e.g., Paystack)
Route.post('/payments/callback', 'PaymentController.callback')

// Delete payment record (if needed, you may want to protect this route)
Route.delete('/payments/:id', 'PaymentController.delete')
Route.delete('/users/:id', 'AuthController.deleteUser')

