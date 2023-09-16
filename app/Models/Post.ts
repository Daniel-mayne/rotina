import { DateTime } from 'luxon'
import { BaseModel, column,  belongsTo,
  BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, Feed, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { PostFilter } from './Filters'






export default class Post extends compose(BaseModel, Filterable)  {

  public static $filter = () => PostFilter

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
