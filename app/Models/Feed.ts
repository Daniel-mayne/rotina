import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, Post, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { FeedFilter } from './Filters'

/**
 * @swagger
 * components:
 *   schemas:
 *     Feed:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         name:
 *           type: string
 *           required: true
 *         url:
 *           type: string
 *           required: true
 *         status:
 *           type: string
 *           enum: [active, deactivated]
 *           required: true
 *           example: "active"
 *         companyId:
 *           type: integer
 *         customerId:
 *           type: integer
 *         createdBy:
 *           type: integer
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         user:
 *           $ref: '#/components/schemas/User'
 *         post:
 *           $ref: '#/components/schemas/Post'
 *       required:
 *         - id
 *         - name
 *         - url
 *         - companyId
 *         - createdBy
 *         - customerId
 *         - status
 *         - createdAt
 *         - updatedAt
 *       example:
 *         id: 123
 *         name: "Professional Feed"
 *         url: "https://professional-feed.com"
 *         companyId: 456
 *         createdBy: 789
 *         customerId: 101
 *         status: "active"
 *         createdAt: "2023-09-21T14:30:00.000-03:00"
 *         updatedAt: "2023-09-21T15:45:00.000-03:00"
 */
/**
   * @swagger
   * paths:
   *   /feeds:
   *     get:
   *       tags:
   *        - Feed
   *       summary: Lista todos as feeds
   *       responses:
   *         '200':
   *           description: Lista de feeds obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Feed'
   *     post:
   *       tags:
   *        - Feed
   *       summary: Cria um novo feed
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Feed'
   *       responses:
   *         '201':
   *           description: Feed criada com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Feed'
   *   /feeds/{id}:
   *     get:
   *       tags:
   *        - Feed
   *       summary: Obtém um feed por ID
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
   *           description: Feed obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Feed'
   *     put:
   *       tags:
   *        - Feed
   *       summary: Atualiza um feed por ID
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
   *                 url:
   *                   type: string
   *                 status:
   *                   type: string
   *       responses:
   *         '200':
   *           description: Feed atualizado com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Feed'
   *     delete:
   *       tags:
   *        - Feed
   *       summary: Deleta uma feed por ID
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
   *           description: Feed deletado com sucesso
   */


export default class Feed extends compose(BaseModel, Filterable)  {

  public static $filter = () =>  FeedFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public url: string

  @column()
  public status: 'active' | 'deactivated'

  @column()
  public companyId: number

  @column()
  public customerId: number
  
  @column()
  public createdBy: number

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

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Post)
  public post: HasMany<typeof Post>
}
