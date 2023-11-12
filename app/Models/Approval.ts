import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, ApprovalItem, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ApprovalFilter } from './Filters'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
/**
 * @swagger
 * components:
 *   schemas:
 *     Approval:
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
 *         approvalItem:
 *           $ref: '#/components/schemas/ApprovalItem'
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
 *         name: "Professional Approval"
 *         url: "https://professional-approval.com"
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
   *   /approvals:
   *     get:
   *       tags:
   *        - Approval
   *       summary: Lista todos as approvals
   *       responses:
   *         '200':
   *           description: Lista de approvals obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Approval'
   *     post:
   *       tags:
   *        - Approval
   *       summary: Cria um novo approval
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Approval'
   *       responses:
   *         '201':
   *           description: Approval criada com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Approval'
   *   /approvals/{id}:
   *     get:
   *       tags:
   *        - Approval
   *       summary: Obtém um approval por ID
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
   *           description: Approval obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Approval'
   *     put:
   *       tags:
   *        - Approval
   *       summary: Atualiza um approval por ID
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
   *           description: Approval atualizado com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Approval'
   *     delete:
   *       tags:
   *        - Approval
   *       summary: Deleta uma approval por ID
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
   *           description: Approval deletado com sucesso
   */

export default class Approval extends compose(BaseModel, Filterable)  {

  public static $filter = () =>  ApprovalFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  @slugify({
    strategy: 'shortId',
    fields: ['name'],
    allowUpdates: true,
  })
  public url: string

  @column()
  public status: 'awaiting approval' | 'approved' | 'denied' | 'deleted'

  @column()
  public companyId: number

  @column()
  public customerId: number
  
  @column()
  public createdBy: number

  @column.dateTime({ 
    serialize: (value: DateTime) => {
      return value
    },
  })
  public approvalDate: DateTime

  @column.dateTime({ 
    serialize: (value: DateTime) => {
      return value
    },
  })
  public reprovedDate: DateTime

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

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => User, {foreignKey: 'createdBy' })
  public user: BelongsTo<typeof User>

  @hasMany(() => ApprovalItem)
  public approvalItems: HasMany<typeof ApprovalItem>
}
