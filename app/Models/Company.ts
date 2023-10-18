import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Approval, File, Persona, User, Customer } from 'App/Models'
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
 *         adminName:
 *           type: string
 *           required: true
 *         adminPassword:
 *           type: string
 *           required: true
 *         adminPhone:
 *           type: string
 *           required: true
 *         adminEmail:
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
 *         approval:
 *           $ref: '#/components/schemas/Approval' 
 *         persona:
 *           $ref: '#/components/schemas/Persona' 
 *         file:
 *           $ref: '#/components/schemas/File'   
 *       required:
 *         - id
 *         - name 
 *         - adminName
 *         - adminEmail
 *         - adminPassword
 *         - adminPhone         
 *       example:
 *         id: 1
 *         name: "XYZ Corporation"
 *         userLimit: 999
 *         status: "active"    
 *         createdAt: "2023-09-21T14:30:00.000-03:00"
 *         updatedAt: "2023-09-21T15:45:00.000-03:00"
 */
/**
@swagger
* paths:
*   /companies:
*     get:
*       tags:
*        - Company
*       summary: Lista todas as companies
*       responses:
*         '200':
*           description: Listagem de companies obtida com sucesso
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Company'
*     post:
*       tags:
*        - Company
*       summary: Cria uma nova company
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Company'
*       responses:
*         '201':
*           description: Company criada com sucesso
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Company'
*   /companies/{id}:
*     get:
*       tags:
*        - Company
*       summary: Obtém uma company por ID
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*             type: integer
*             format: int64
*             minimum: 1
*       responses:
*         '200':
*           description: Company obtida com sucesso
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Company'
*     put:
*       tags:
*        - Company
*       summary: Atualiza uma company por ID
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*             type: integer
*             format: int64
*             minimum: 1
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 name:
*                   type: string
*                 smtpHost:
*                   type: string
*                 smtpPort:
*                   type: string
*                 smtpPassword:
*                   type: string
*                 status:
*                   type: string
*       responses:
*         '200':
*           description: Company atualizada com sucesso
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Company'
*     delete:
*       tags:
*        - Company
*       summary: Deleta uma company por ID
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*             type: integer
*             format: int64
*             minimum: 1
*       responses:
*         '204':
*           description: Company deletado com sucesso
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

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @hasMany(()=> Customer)
  public customers: HasMany<typeof Customer>

  @hasMany(()=> Approval)
  public approvals: HasMany<typeof Approval>

  @hasMany(()=> Persona)
  public personas: HasMany<typeof Persona>

  @hasMany(()=> File)
  public files: HasMany<typeof File>

}
