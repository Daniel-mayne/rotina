import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Customer from 'App/Models/Customer'

export default class CustomerFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Customer, Customer>

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public name(name: string): void {
    this.$query.whereLike('name', `%${name}%`)
  }

  public type(types: string) {
    this.$query.whereIn('type', types.split(','))
  }

  public accountManager(accountManagerIds: string): void {
    this.$query.whereIn('account_manager_id', accountManagerIds.split(','))
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
