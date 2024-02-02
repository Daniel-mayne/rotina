import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import TaskProjectTemplate from 'App/Models/TaskProjectTemplate'


export default class TaskProjectTemplateFilter extends BaseModelFilter {
    public $query: ModelQueryBuilderContract<typeof TaskProjectTemplate, TaskProjectTemplate>

  
    public taskId(taskIds: string) {
      this.$query.whereIn('task_id', taskIds.split(','))

    }

    public projectId(projectIds: string) {
      this.$query.whereIn('project_id', projectIds.split(','))
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