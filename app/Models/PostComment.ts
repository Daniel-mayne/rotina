import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { ApprovalItem, User, Notification } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { PostCommentFilter } from './Filters'

export default class PostComment extends compose(BaseModel, Filterable)  {

  public static $filter = () =>   PostCommentFilter
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public approvalItemId: number

  @column()
  public companyId: number

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

  
  @hasMany(()=> Notification)
  public notifications: HasMany<typeof Notification>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => ApprovalItem)
  public approvalItem: BelongsTo<typeof ApprovalItem>
}
