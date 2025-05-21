'use strict'

const Schema = use('Schema')

class PaymentsSchema extends Schema {
  up () {
    this.create('payments', (table) => {
      table.increments()
      table.integer('startup_id').unsigned().notNullable()
      table.string('startup_name').notNullable()
      table.string('email').notNullable()
      table.integer('amount').notNullable()
      table.integer('payment_id').notNullable()
      table.string('payment_reference').notNullable()
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('payments')
  }
}

module.exports = PaymentsSchema
