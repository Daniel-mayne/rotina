import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { ApprovalItem, File } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ApprovalItemFilter } from './Filters'



export default class ApprovalItemFile extends compose(BaseModel, Filterable) {

  public static $filter = () => ApprovalItemFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public approvalItemId: number

  @column()
  public fileId: number

  @column()
  public order: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    },
  })
  public updatedAt: DateTime

  @belongsTo(() => ApprovalItem)
  public approvalItem: BelongsTo<typeof ApprovalItem>

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>
}
