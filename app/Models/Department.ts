import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { User, Company } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { DepartmentFilter } from './Filters'

export default class Department extends compose(BaseModel, Filterable) {
  public static $filter = () => DepartmentFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public companyId: number

  @column()
  public status: 'active' | 'deactivated' | 'deleted'

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

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>
}
