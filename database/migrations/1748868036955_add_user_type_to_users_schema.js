'use strict'

const Schema = use('Schema')

class AddUserTypeToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table
        .enu('user_type', ['grantee', 'grantor', 'admin', 'vendor'])
        .notNullable()
        .defaultTo('grantee')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('user_type')
    })
  }
}

module.exports = AddUserTypeToUsersSchema
