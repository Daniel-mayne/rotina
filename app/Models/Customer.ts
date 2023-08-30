import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public logo?: string

  @column()
  public status?: 'active' | 'deactivated'

  @column()
  public companyId: number

  @column()
  public accountManagerId: number

  @column()
  public createdBy: number

  @column()
  public fillingPercentage: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>


}
