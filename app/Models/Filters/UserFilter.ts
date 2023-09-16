import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>

  public status (status: string, auth: any ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')).whereIn('companyId', auth.user?.companyId))
  }
}
