import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('approval_item_id').unsigned().notNullable().references('id').inTable('approval_items').onDelete('CASCADE')
      table.integer('post_comment_id').unsigned().notNullable().references('id').inTable('post_comments').onDelete('CASCADE')
      table.enum('status', ['sent', 'received', 'seen', 'not_seen']).defaultTo('sent')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
