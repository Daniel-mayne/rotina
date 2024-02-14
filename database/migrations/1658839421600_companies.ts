import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('smtp_host', 255).nullable()
      table.string('smtp_port', 255).nullable()
      table.string('smtp_password', 255).nullable()
      table.integer('user_limit').notNullable().defaultTo(5)
      table
        .enum('status', ['active', 'deactivated', 'waiting_activation'])
        .notNullable()
        .defaultTo('active')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
