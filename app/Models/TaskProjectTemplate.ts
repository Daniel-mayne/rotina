import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { TaskProjectTemplateFilter } from './Filters'
import { TaskTemplate, ProjectTemplate } from 'App/Models'

export default class TaskProjectTemplate extends compose(BaseModel, Filterable) {
  public static $filter = () => TaskProjectTemplateFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public taskTemplateId: number

  @column()
  public projectTemplateId: number

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('HH:mm:ss')
    },
  })
  public deadlineStart: DateTime

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

  @belongsTo(() => TaskTemplate)
  public taskTemplate: BelongsTo<typeof TaskTemplate>

  @belongsTo(() => ProjectTemplate)
  public projectTemplate: BelongsTo<typeof ProjectTemplate>
}
