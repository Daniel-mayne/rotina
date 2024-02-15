import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ProjectTemplateFilter } from './Filters'
import { Company, Project, TaskProjectTemplate, User } from 'App/Models'

export default class ProjectTemplate extends compose(BaseModel, Filterable) {
  public static $filter = () => ProjectTemplateFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public projectTitle: string

  @column()
  public projectDescription: string

  @column()
  public createdBy: number

  @column()
  public companyId: number

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

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  @hasMany(() => TaskProjectTemplate)
  public taskProjectTemplates: HasMany<typeof TaskProjectTemplate>
}
