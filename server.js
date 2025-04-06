'use strict'

const { Ignitor } = require('@adonisjs/ignitor')
const Env = use('Env')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .then(() => {
    const host = Env.get('HOST', '0.0.0.0') // Default to 0.0.0.0
    const port = Env.get('PORT', 3333) // Use the port from the environment variable
    console.log(`App is running on http://${host}:${port}`)
  })
  .catch(console.error)
