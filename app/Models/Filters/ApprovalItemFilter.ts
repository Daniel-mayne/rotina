import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import ApprovalItem from 'App/Models/ApprovalItem'

export default class ApprovalItemFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof ApprovalItem, ApprovalItem>

  public status (status: string ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }
}
