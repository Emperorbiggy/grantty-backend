'use strict'

const Schema = use('Schema')

class FoundersSchema extends Schema {
  up () {
    this.create('founders', (table) => {
      table.increments()
      table.string('full_name').notNullable()
      table.string('linkedin_profile').nullable()
      table.string('email_address').notNullable().unique()
      table.string('phone_no').nullable()
      table.string('profile_img').nullable()
      table.string('nin').nullable()
      table.string('role').nullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('founders')
  }
}

module.exports = FoundersSchema
