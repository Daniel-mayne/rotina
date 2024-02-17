import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.integer('current_user_id').unsigned().nullable().references('id').inTable('users')
      table
        .integer('client_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('customers')
        .onDelete('CASCADE')
      table.date('due_date')
      table.integer('approval_user_id').unsigned().nullable().references('id').inTable('users')
      table.time('estimated_time').nullable()
      table.integer('task_template_id').unsigned().nullable()
      table.text('taskDescription', 'longtext')
      table
        .integer('company_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      table
        .enum('status', ['waiting_approval', 'approved', 'disapproved', 'deleted'])
        .nullable()
        .defaultTo('waiting_approval')
      table.integer('project_id').unsigned().nullable()
      table.integer('order').unsigned().nullable()
      table.integer('initial_user_id').unsigned().nullable().references('id').inTable('users')
      table.integer('sent_approval_user_id').unsigned().nullable().references('id').inTable('users')
      table.date('sent_approval_date').nullable()
      table.date('approval_date').nullable()
      table.float('progress').unsigned().nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
