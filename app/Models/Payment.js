'use strict'

const Model = use('Model')

class Startup extends Model {
  payments () {
    return this.hasMany('App/Models/Payment', 'id', 'startup_id')
  }
}

module.exports = Startup
