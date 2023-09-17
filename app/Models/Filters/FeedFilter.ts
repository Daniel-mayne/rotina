import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Feed from 'App/Models/Feed'

export default class FeedFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Feed, Feed>

  public status (status: string ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }
}
