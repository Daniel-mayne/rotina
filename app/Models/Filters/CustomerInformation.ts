import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import CustomerInformation from 'App/Models/CustomerInformation'

export default class CustomerInformationFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof CustomerInformation, CustomerInformation>

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public customer(ids: string): void {
    this.$query.whereIn('customer_id', ids.split(','))
  }
}
