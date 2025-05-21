// app/Models/Startup.js
'use strict'

const Model = use('Model')

class Startup extends Model {
  static get table() {
    return 'startups'
  }

  founder() {
    return this.belongsTo('App/Models/Founder')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Startup
