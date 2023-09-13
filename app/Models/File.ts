import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, User } from 'App/Models'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
/**
*  @swagger
*  components:
*    schemas:
*      File:
*        type: object
*        properties:
*          id:
*            type: integer
*            required: true
*          name:
*            type: string
*            required: true
*          extension:
*            type: string
*            required: true
*          size:
*            type: integer
*            required: true
*          link:
*            type: string
*            required: true
*          companyId:
*            type: integer
*            required: true
*          createdAt:
*            type: string
*          createdBy:
*            type: string
*          updatedAt:
*            type: string
*          company:
*            $ref: '#/components/schemas/Deal'
*          creator:
*            $ref: '#/components/schemas/User'
*/

export default class File extends BaseModel {
public static namingStrategy = new CamelCaseNamingStrategy()
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public extension: string

  @column()
  public size: number

  @column()
  public link: string

  @column()
  public companyId: number

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => User)
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>
}
