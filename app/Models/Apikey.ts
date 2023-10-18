import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { User, Company } from 'App/Models'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
/**
 *  @swagger
 *  components:
 *    schemas:
 *      Apikey:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            required: true
 *          value:
 *            type: string
 *            required: true
 *          companyId:
 *            type: integer
 *          userId:
 *            type: integer
 *          status:
 *            type: string
 *            enum: [active, deactivated]
 *            required: true
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *          user:
 *            $ref: '#/components/schemas/User'
 *          company:
 *            $ref: '#/components/schemas/Company'
 */

export default class Apikey extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  public id: number

  @column()
  public value: string

  @column()
  public title: string

  @column()
  public companyId: number

  @column()
  public userId: number

  @column()
  public status: 'active' | 'deactivated'

  @column.dateTime({ 
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    },
   })
  public createdAt: DateTime

  @column.dateTime({ 
    autoCreate: true, 
    autoUpdate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    },
   })
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
