import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public currentUserId: number

  @column()
  public clientId: number

  @column.dateTime({
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy')
    },
  })
  public dueDate: DateTime

  @column()
  public approvalUserId: number

  @column.dateTime({
    serialize: (value: DateTime) => {
      return value.toFormat('HH:mm:ss')
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
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy')
    },
  })
  public sentApprovalDate: DateTime

  @column.dateTime({
    serialize: (value: DateTime) => {
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
}
