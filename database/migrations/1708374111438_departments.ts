import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'departments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.integer('company_id').unsigned().references('id').inTable('companies')
      table.enu('status', ['active', 'inactive']).notNullable().defaultTo('active')
      table.integer('department_leader_id').unsigned().references('id').inTable('users')
      table.integer('Department _coordinator_id').unsigned().references('id').inTable('users')
      table.integer('userId').unsigned().references('id').inTable('users')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
