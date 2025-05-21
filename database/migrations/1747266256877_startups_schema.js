'use strict'

const Schema = use('Schema')

class StartupsSchema extends Schema {
  up () {
    this.create('startups', (table) => {
      table.increments()
      table.string('startup_name').notNullable()
      table.text('startup_description').nullable()
      table.string('startup_location').nullable()
      table.string('startup_website').nullable()
      table.string('startup_email').notNullable().unique()
      table.string('startup_picture').nullable()
      table.integer('team_size').nullable()
      table.integer('no_of_teams').nullable()
      table.string('cofounder').nullable()
      table.string('profile_image').nullable()
      table.string('linkedin_profile').nullable()
      table.string('nin').nullable()
      table.decimal('amount_of_funds', 15, 2).nullable()
      table.text('usage_of_funds').nullable()
      table.integer('no_of_customers').nullable()
      table.string('video').nullable()
      table.string('startup_industry').nullable()
      table.integer('founder_id').unsigned().references('id').inTable('founders').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('startups')
  }
}

module.exports = StartupsSchema
