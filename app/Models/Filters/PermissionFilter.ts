import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Permission from 'App/Models/Permission'

export default class PermissionFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Permission, Permission>

  public search(word: string): void {
    this.$query.andWhereRaw('(name LIKE)', [`%${word}%`])
  }

  public departmentId(departmentIds: string) {
    this.$query.whereIn('department_id', departmentIds.split(','))
  }

  public name(name: string): void {
    this.$query.whereLike('name', `%${name}%`)
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
