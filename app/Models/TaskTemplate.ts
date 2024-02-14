import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { TaskTemplateFilter } from './Filters'
import { User, TaskProjectTemplate } from 'App/Models'

export default class TaskTemplate extends compose(BaseModel, Filterable) {
  public static $filter = () => TaskTemplateFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public createdBy: number

  @column()
  public companyId: number

  @column()
  public taskTitle: string

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public deadlineDate: DateTime

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public estimatedTaskTime: DateTime

  @column()
  public taskDescription: string

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
  public user: BelongsTo<typeof User>

  @hasMany(() => TaskProjectTemplate)
  public taskProjectTemplates: HasMany<typeof TaskProjectTemplate>
}
