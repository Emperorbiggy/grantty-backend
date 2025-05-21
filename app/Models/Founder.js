// app/Models/Founder.js
'use strict'

const Model = use('Model')

class Founder extends Model {
  static get table() {
    return 'founders'
  }

  startups() {
    return this.hasMany('App/Models/Startup')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Founder
