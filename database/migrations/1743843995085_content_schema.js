'use strict'

const Schema = use('Schema')

class ContentSchema extends Schema {
  up () {
    this.create('contents', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.text('text').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('contents')
  }
}

module.exports = ContentSchema
