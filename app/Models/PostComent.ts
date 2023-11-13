import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { ApprovalItem, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { PostComentFilter } from './Filters'

export default class PostComent extends compose(BaseModel, Filterable)  {

  public static $filter = () =>   PostComentFilter
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public approvalItemId: number

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
}
