import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'department_permission'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('department_id')
        .unsigned()
        .references('id')
        .inTable('departments')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
