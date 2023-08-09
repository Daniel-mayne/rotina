import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('phone', 255).notNullable()
      table.string('password', 180).notNullable()
      table.enum('status', ['active', 'deactivated']).notNullable().defaultTo('active')
      table.enum('type', ['user', 'administrator', 'owner']).notNullable().defaultTo('user')
      table.string('picture', 255).nullable()
      table.time('work_load').notNullable().defaultTo('09:00:00')
      table.time('work_start').notNullable().defaultTo('08:30:00')
      table.time('work_end').notNullable().defaultTo('18:00:00')
      table.time('lunch_start').notNullable().defaultTo('12:00:00')
      table.time('lunch_end').notNullable().defaultTo('13:30:00')
      table
        .integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      table.string('remember_me_token').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
