import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { TaskFilter } from './Filters'
import { Company, Customer, Project, TaskTemplate, User } from 'App/Models'

export default class Task extends compose(BaseModel, Filterable) {
  public static $filter = () => TaskFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public taskTitle: string

  @column()
  public currentUserId: number

  @column()
  public clientId: number

  @column()
  public approvalUserId: number

  @column()
  public taskTemplateId: number

  @column()
  public taskDescription: string

  @column()
  public companyId: number

  @column()
  public customerId: number

  @column()
  public status: 'waiting_approval' | 'approved' | 'disapproved' | 'deleted'

  @column()
  public projectId: number

  @column()
  public order: number

  @column()
  public initialUserId: number

  @column()
  public sentApprovalUserId: number

  @column()
  public progress: number

  @column.dateTime({
    serialize: (value: DateTime | null | undefined) => {
      return value instanceof DateTime ? value.toFormat('dd/MM/yyyy') : null
    },
  })
  public dueDate: DateTime

  @column.dateTime({
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy')
    },
  })
  public approvaDate: DateTime

  @column.dateTime({
    serialize: (value: DateTime | null | undefined) => {
      return value instanceof DateTime ? value.toFormat('dd/MM/yyyy') : null
    },
  })
  public estimatedTime: DateTime

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      return value ? value.toFormat('dd/MM/yyyy HH:mm:ss') : value
    },
  })
  public sentApprovalDate: DateTime

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

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => TaskTemplate)
  public taskTemplate: BelongsTo<typeof TaskTemplate>

  @belongsTo(() => Customer, {
    foreignKey: 'clientId',
  })
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => User, {
    foreignKey: 'initialUserId',
  })
  public user: BelongsTo<typeof User>
}
