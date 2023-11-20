import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'approval_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.text('text', 'longtext').notNullable()
      table.timestamp('approval_date', { useTz: true })
      table.timestamp('reproved_date', { useTz: true })
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
        table
        .integer('approval_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        table
        .integer('persona_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('personas')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
