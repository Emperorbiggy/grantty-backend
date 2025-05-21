'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static get table() {
    return 'users'  // default, but explicitly set if you want
  }

  static boot() {
    super.boot()

    // Hash password before saving to DB
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  // Optional: static method to get user by email
  static async getByEmail(email) {
    return await this.query().where('email', email).first()
  }

  // Instance method to compare password
  async comparePassword(password) {
    return await Hash.verify(password, this.password)
  }

  // Relationship to tokens for authentication
  tokens() {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
