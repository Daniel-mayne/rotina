import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Feed, File, Persona, User, Customer } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { CompanyFilter } from './Filters'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         name:
 *           type: string
 *           required: true
 *         smtpHost:
 *           type: string
 *         smtpPort:
 *           type: string
 *         smtpPassword:
 *           type: string
 *         userLimit:
 *           type: integer
 *         refferName:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, deactivated, waiting_activation]
 *           required: true
 *           example: "active"
 *         stripeSubscriptionStatus:
 *           type: string
 *         stripeSubscriptionId:
 *           type: integer
 *         stripeCustomerId:
 *           type: integer
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User' 
 *         customer:
 *           $ref: '#/components/schemas/Customer' 
 *         feed:
 *           $ref: '#/components/schemas/Feed' 
 *         persona:
 *           $ref: '#/components/schemas/Persona' 
 *         file:
 *           $ref: '#/components/schemas/File'   
 *       required:
 *         - id
 *         - name 
 *         - status
 *         - createdAt  
 *         - updatedAt  
 *       example:
 *         id: 1
 *         name: "XYZ Corporation"
 *         status: "active"    
 *         smtpHost: "smtp.xyz.com"
 *         smtpPort: "587"
 *         smtpPassword: "***********"
 *         userLimit: 100
 *         refferName: "Ref XYZ"
 *         stripeSubscriptionStatus: "active"
 *         stripeSubscriptionId: 12345
 *         stripeCustomerId: 67890
 *         createdAt: "2023-09-21T14:30:00.000-03:00"
 *         updatedAt: "2023-09-21T15:45:00.000-03:00"
 */



export default class Company extends  compose(BaseModel, Filterable) {

  public static $filter = () => CompanyFilter

  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public smtpHost?: string

  @column()
  public smtpPort?: string

  @column()
  public smtpPassword?: string

  @column()
  public userLimit?: number

  @column()
  public refferName?: string

  @column()
  public status?: 'active' | 'deactivated' | 'waiting_activation'

  @column()
  public stripeSubscriptionStatus?: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing'

  @column()
  public stripeSubscriptionId?: string

  @column()
  public stripeCustomerId?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @hasMany(()=> Customer)
  public customers: HasMany<typeof Customer>

  @hasMany(()=> Feed)
  public feeds: HasMany<typeof Feed>

  @hasMany(()=> Persona)
  public personas: HasMany<typeof Persona>

  @hasMany(()=> File)
  public files: HasMany<typeof File>

}
