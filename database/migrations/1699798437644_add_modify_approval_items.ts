import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'add_modify_approval_items'

  public async up() {
    this.schema.alterTable('approval_items', (table) => {
      table.string('title', 255).notNullable()
      table.text('text', 'longtext').notNullable()
      table
        .integer('guest_approval_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable('approval_items', (table) => {
      table.dropColumn('name')
    })
  }
}
