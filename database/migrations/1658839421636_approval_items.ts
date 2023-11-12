import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'approval_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('approval_item_date', { useTz: true }).notNullable()
      table
        .enum('status', ['waiting_approval', 'approved', 'disapproved'])
        .notNullable()
        .defaultTo('waiting_approval')
      table
        .integer('approval_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('approvals')
        .onDelete('CASCADE')
      table
        .integer('created_by')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        table
        .integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
