import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import PostComment from 'App/Models/PostComment'

export default class PostCommentFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof PostComment, PostComment>

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public approvalItem(ids: string): void {
    this.$query.whereIn('approval_item_id', ids.split(','))
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
