const Route = use('Route')

// Public routes
Route.post('/signup', 'AuthController.store')
Route.post('/login', 'AuthController.login')

// Protected routes - apply auth middleware
Route.group(() => {
  Route.get('/profile', 'AuthController.show')
  Route.put('/profile', 'AuthController.update')
  Route.post('/logout', 'AuthController.logout')
}).middleware(['auth'])
Route.post('/startups', 'StartupController.create').middleware('auth')
Route.get('/startups', 'StartupController.getAll')
Route.get('/startups/:id', 'StartupController.getById')
Route.get('user/startups', 'StartupController.getByUserId').middleware(['auth']);
Route.post('payments/initialize', 'PaymentController.initialize')
Route.get('payments/verify/:reference', 'PaymentController.verify')
Route.get('/payments', 'PaymentController.all')
Route.get('/payments/:id', 'PaymentController.getById')
Route.delete('/payments/:id', 'PaymentController.delete')
Route.get('test', ({ response }) => {
  return response.json({ message: 'Server is running' })
})




