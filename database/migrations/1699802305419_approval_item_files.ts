import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'approval_item_files'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('approval_item_id').unsigned().notNullable().references('id').inTable('approval_items').onDelete('CASCADE')
      table.integer('file_id').unsigned().notNullable().references('id').inTable('files').onDelete('CASCADE')
      table.integer('order')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
