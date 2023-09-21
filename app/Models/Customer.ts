import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, User, Persona, Feed } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { CustomerFilter } from './Filters'


/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         name:
 *           type: string
 *           required: true
 *         status:
 *           type: string
 *           enum: [active, deactivated]
 *           required: true
 *           example: "active"
 *         companyId:
 *           type: integer
 *         accountManagerId:
 *           type: integer
 *         createdBy:
 *           type: integer
 *         fillingPercentage:
 *           type: integer
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         user:
 *           $ref: '#/components/schemas/User'
 *         persona:
 *           $ref: '#/components/schemas/Persona'
 *         feed:
 *           $ref: '#/components/schemas/Feed'
 *       required:
 *         - id
 *         - name
 *         - status
 *         - companyId
 *         - createdBy
 *         - accountManagerId
 *         - fillingPercentage
 *         - createdAt
 *         - updatedAt
 *       example:
 *         id: 1
 *         name: "ABC Corporation"
 *         status: "active"
 *         companyId: 3
 *         createdBy: 4
 *         accountManagerId: 5
 *         fillingPercentage: 25
 *         createdAt: "2023-09-21T14:30:00.000-03:00"
 *         updatedAt: "2023-09-21T15:45:00.000-03:00"
 */


export default class Customer extends compose(BaseModel, Filterable) {

  public static $filter = () => CustomerFilter

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

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  @hasMany(() => Persona)
  public personas: HasMany<typeof Persona>

  @hasMany(() => Feed)
  public feeds: HasMany<typeof Feed>

}
