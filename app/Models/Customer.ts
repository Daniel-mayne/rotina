import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, User, Persona, Feed } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { CustomerFilter } from './Filters'

export default class Customer extends compose(BaseModel, Filterable) {

  public static $filter = () => CustomerFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public logo?: string

  @column()
  public status?: 'active' | 'deactivated'

  @column()
  public companyId: number

  @column()
  public accountManagerId: number

  @column()
  public createdBy: number

  @column()
  public fillingPercentage: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  @hasMany(() => Persona)
  public personas: HasMany<typeof Persona>

  @hasMany(() => Feed)
  public feeds: HasMany<typeof Feed>

}
