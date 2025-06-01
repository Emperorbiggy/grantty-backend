'use strict'

const Schema = use('Schema')

class NewsletterSubscribersSchema extends Schema {
  up () {
    this.create('newsletter_subscribers', (table) => {
      table.increments()
      table.string('email').notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('newsletter_subscribers')
  }
}

module.exports = NewsletterSubscribersSchema
