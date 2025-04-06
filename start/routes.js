'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// This is your GET route
Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

// This is your POST route for content
Route.post('/content', 'ContentController.store')
Route.get('/content', 'ContentController.index')
Route.put('/content/:id', 'ContentController.update')
Route.delete('/content/:id', 'ContentController.destroy')
Route.post('/chat', 'ChatbotController.store');


