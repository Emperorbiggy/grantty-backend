'use strict'

const Schema = use('Schema')

class AddExtraFieldsToStartupsSchema extends Schema {
  up () {
    this.table('startups', (table) => {
      table.decimal('amount_raised', 15, 2).notNullable().defaultTo(0.00)
      table.string('verification_status').notNullable().defaultTo('pending')
      table.string('status').notNullable().defaultTo('processing')
    })
  }

  down () {
    this.table('startups', (table) => {
      table.dropColumn('amount_raised')
      table.dropColumn('verification_status')
      table.dropColumn('status')
    })
  }
}

module.exports = AddExtraFieldsToStartupsSchema
