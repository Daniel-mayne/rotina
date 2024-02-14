import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import CustomerInformation from 'App/Models/CustomerInformation'

export default class CustomerInformationFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof CustomerInformation, CustomerInformation>

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public customer(ids: string): void {
    this.$query.whereIn('customer_id', ids.split(','))
  }

  public search(word: string): void {
    this.$query.andWhereRaw('(title LIKE ? OR text LIKE)', [`%${word}%`, `%${word}%`])
  }

  public title(title: string): void {
    this.$query.whereLike('title', `%${title}%`)
  }

  public text(text: string): void {
    this.$query.whereLike('text', `%${text}%`)
  }

  public type(types: string) {
    this.$query.whereIn('type', types.split(','))
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
