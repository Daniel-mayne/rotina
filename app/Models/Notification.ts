import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { User, ApprovalItem,  PostComment} from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { NotificationFilter } from './Filters'

export default class Notification extends compose(BaseModel, Filterable) {

  public static $filter = () => NotificationFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public approvalItemId: number

  @column()
  public commentId: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => ApprovalItem)
  public approvalItem: BelongsTo<typeof ApprovalItem>

  @belongsTo(() => PostComment)
  public comment: BelongsTo<typeof PostComment>
}
