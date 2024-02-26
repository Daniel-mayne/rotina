import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Team from 'App/Models/Team'

export default class TeamFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Team, Team>

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public search(word: string): void {
    this.$query.andWhereRaw('(name LIKE ? OR description LIKE)', [`%${word}%`, `%${word}%`])
  }

  public name(name: string): void {
    this.$query.whereLike('name', `%${name}%`)
  }

  public description(description: string): void {
    this.$query.whereLike('description', `%${description}%`)
  }

  public company(companyIds: string): void {
    this.$query.whereIn('company_id', companyIds.split(','))
  }

  public user(userIds: string): void {
    this.$query.whereIn('user_id', userIds.split(','))
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
