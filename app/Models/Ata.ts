import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { User, Company, Customer } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { AtaFilter } from './Filters'

export default class Ata extends compose(BaseModel, Filterable) {
  public static $filter = () => AtaFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column({
    prepare: (value: any) => JSON.stringify(value),
  })
  public description: { [key: string]: any }

  @column()
  public companyId: number

  @column()
  public customerId: number

  @column()
  public createdBy: number

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

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>
}
