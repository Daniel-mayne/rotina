import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import TaskTemplate from 'App/Models/TaskTemplate'


export default class TaskTemplateFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof TaskTemplate, TaskTemplate>

  public search(word: string): void {
    this.$query.andWhereRaw("(title LIKE ? OR task_title LIKE ? OR task_description LIKE)", [`%${word}%`, `%${word}%`, `%${word}%`])
  }

  public title(title: string): void {
    this.$query.whereLike('title', `%${title}%`)
  }

  public task_title(task_title: string): void {
    this.$query.whereLike('task_title', `%${task_title}%`)
  }

  public task_description(task_description: string): void {
    this.$query.whereLike('task_description', `%${task_description}%`)
  }

  public createdAt(value: string) {
    const dates: string[] = value.split(',')
    const firstDate = DateTime.fromFormat(dates[0]!, 'dd/MM/yyyy').startOf('day').toSQL()
    const seccondDate = dates[1]
      ? DateTime.fromFormat(dates[1], 'dd/MM/yyyy').endOf('day').toSQL()
      : DateTime.fromFormat(dates[0]!, 'dd/MM/yyyy').endOf('day').toSQL()
    this.$query.whereBetween('created_at', [firstDate!, seccondDate!])
  }
}