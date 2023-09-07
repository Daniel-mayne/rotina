import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Customer from 'App/Models/Customer'

export default class CustomerFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Customer, Customer>

  public status (status: string ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }
}
