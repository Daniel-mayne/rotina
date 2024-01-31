import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { TaskTemplateFilter } from './Filters'

export default class TaskTemplate extends compose (BaseModel, Filterable) {
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
    }
  })
  public deadlineDate: DateTime

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    }
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
}
