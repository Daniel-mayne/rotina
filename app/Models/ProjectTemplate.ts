import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ProjectTemplateFilter } from './Filters'


export default class ProjectTemplate extends compose (BaseModel, Filterable) {


  public static $filter = () => ProjectTemplateFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public createdBy: number

  @column()
  public companyId: number

  @column()
  public projectTitle: string
  
  @column()
  public projectDescription: string


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
}
