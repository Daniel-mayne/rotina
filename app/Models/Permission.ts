import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { Company, Department } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { PermissionFilter } from './Filters'

export default class Permission extends compose(BaseModel, Filterable) {
  public static $filter = () => PermissionFilter
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public companyId: number

  @column()
  public departmentId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @manyToMany(() => Department)
  public departments: ManyToMany<typeof Department>
}
