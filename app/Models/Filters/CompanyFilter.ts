import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Company'

export default class CompanyFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Company, Company>

  public status (status: string ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }
}
