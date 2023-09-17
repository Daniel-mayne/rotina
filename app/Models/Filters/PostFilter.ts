import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post'

export default class PostFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Post, Post>

  public status (status: string ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }
}
