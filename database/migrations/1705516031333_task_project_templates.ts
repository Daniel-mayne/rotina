import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'task_projects_templates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('task_id').unsigned().notNullable().references('id').inTable('task_templates').onDelete('CASCADE')
      table.integer('project_id').unsigned().notNullable().references('id').inTable('project_templates').onDelete('CASCADE')
      table.time('deadline_start').defaultTo('01:00:00')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
