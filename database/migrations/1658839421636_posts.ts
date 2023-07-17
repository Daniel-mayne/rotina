import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.timestamp('post_date', { useTz: true }).notNullable()
      table
        .enum('status', ['waiting_approval', 'approved', 'disapproved'])
        .notNullable()
        .defaultTo('waiting_approval')
      table
        .integer('id_feed')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('feeds')
        .onDelete('CASCADE')
      table
        .integer('created_by')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
