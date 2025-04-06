'use strict'

/*
|---------------------------------------------------------------------------
| Http server
|---------------------------------------------------------------------------
| This file bootstraps Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
*/

const { Ignitor } = require('@adonisjs/ignitor')
const Env = require('@adonisjs/framework/src/Env')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .then(() => {
    const host = Env.get('HOST', '0.0.0.0') // Default to 0.0.0.0
    const port = Env.get('PORT', 3333) // Use the port from the environment variable
    console.log(`App is running on http://${host}:${port}`)
  })
  .catch(console.error)
