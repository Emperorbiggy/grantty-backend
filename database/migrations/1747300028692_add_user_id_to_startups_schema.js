'use strict'

const Schema = use('Schema')

class AddUserIdToStartupsSchema extends Schema {
  up () {
    this.table('startups', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  down () {
    this.table('startups', (table) => {
      table.dropColumn('user_id')
    })
  }
}

module.exports = AddUserIdToStartupsSchema
