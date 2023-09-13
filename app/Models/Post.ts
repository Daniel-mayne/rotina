import { DateTime } from 'luxon'
import { BaseModel, column,  belongsTo,
  BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, Feed, User } from 'App/Models'




export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({
    serialize: (value: DateTime) => {
      return value
    }
  })
  public postDate: DateTime

  @column()
  public status: 'waiting_approval' | 'approved' | 'disapproved'

  @column()
  public feedId: number

  @column()
  public createdBy: number

  @belongsTo(() => Feed)
  public feeds: BelongsTo<typeof Feed>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
