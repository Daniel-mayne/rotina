import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('work_start')
      table.dropColumn('work_end')
      table.dropColumn('lunch_start')
      table.dropColumn('lunch_end')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.time('work_start').notNullable().defaultTo('08:30:00')
      table.time('work_end').notNullable().defaultTo('18:00:00')
      table.time('lunch_start').notNullable().defaultTo('12:00:00')
      table.time('lunch_end').notNullable().defaultTo('13:30:00')
    })
  }
}
