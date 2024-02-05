import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'personas'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('approval_item_id').unsigned().nullable().references('id').inTable('personas').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('approval_item_id')
    })
  }
}
