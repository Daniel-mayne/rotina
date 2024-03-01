import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { TaskFilter } from './Filters'
import { Company, Customer, Project, User } from 'App/Models'

export default class Task extends compose(BaseModel, Filterable) {
  public static $filter = () => TaskFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public currentUserId: number

  @column()
  public clientId: number

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('dd/MM/yyyy')
    },
  })
  public dueDate: DateTime

  @column()
  public approvalUserId: number

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public estimatedTime: DateTime

  @column()
  public taskTempateId: number

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

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public sent_approval_date: DateTime

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('dd/MM/yyyy')
    },
  })
  public approvaDate: DateTime

  @column()
  public progress: number

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
