'use strict'

const Schema = use('Schema')

class AddVerificationFieldsToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('verification_code', 10).nullable()
      table.boolean('is_verified').defaultTo(false)
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('verification_code')
      table.dropColumn('is_verified')
    })
  }
}

module.exports = AddVerificationFieldsToUsersSchema
