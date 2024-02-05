import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Approval from 'App/Models/Approval'

export default class ApprovalFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Approval, Approval>

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public name(name: string): void {
    this.$query.whereLike('name', `%${name}%`)
  }

  public url(urls: string): void {
    this.$query.where('url', urls.trim())
  }

  public customer(customerIds: string): void {
    this.$query.whereIn('customer_id', customerIds.split(','))
  }

  public createdBy(createdBys: string): void {
    this.$query.whereIn('created_by', createdBys.split(','))
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
