import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'personas'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['active', 'deactivated']).notNullable().defaultTo('active')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {})
  }
}
