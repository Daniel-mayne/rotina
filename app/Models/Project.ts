import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ProjectFilter } from './Filters'
import ProjectTemplate from './ProjectTemplate'

export default class Project extends compose(BaseModel, Filterable) {

  public static $filter = () => ProjectFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public projectDescription: string

  @column()
  public companyId: number

  @column()
  public customerId: number

  @column()
  public createdBy: number

  @column()
  public projectTemplateId: number

  @column()
  public estimatedDelivery: Date

  @column()
  public status: 'active' | 'deactivated'

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

  @belongsTo(()=> ProjectTemplate)
  public projectTemplate: BelongsTo<typeof ProjectTemplate>
}
