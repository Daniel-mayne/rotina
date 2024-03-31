import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'approval_items'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('status', ['waiting_approval', 'approved', 'disapproved', 'deleted'])
        .notNullable()
        .defaultTo('waiting_approval')
        .alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {})
  }
}
