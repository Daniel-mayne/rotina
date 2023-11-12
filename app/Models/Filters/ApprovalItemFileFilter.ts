import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import ApprovalItemFile from 'App/Models/ApprovalItemFile'

export default class ApprovalItemFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof ApprovalItemFile, ApprovalItemFile>

  public status (status: string ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }
  
  

  public approvalItemId(approvalItemIds: string) {
    this.$query.whereIn('approval_item_id', approvalItemIds.split(','))
  }
  public fileId(fileIds: string) {
    this.$query.whereIn('file_id', fileIds.split(','))
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
