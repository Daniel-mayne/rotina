import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, ApprovalItem, User, File } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ApprovalFilter } from './Filters'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
/**
 * @swagger
 * paths:
 *   /approvals:
 *     get:
 *       tags:
 *        - Approval
 *       summary: Liste todos os Approvals.
 *       responses:
 *         '200':
 *           description: Lista de Approvals obtida com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Approval'
 *
 *     post:
 *       tags:
 *        - Approval
 *       summary: Crie um novo Approval.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Approval'
 *       responses:
 *         '201':
 *           description: Approval criado com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Approval'
 *
 *   /approvals/{id}:
 *     get:
 *       tags:
 *        - Approval
 *       summary: Obtenha um Approval por ID.
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
 *           description: Approval obtido com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Approval'
 *
 *     put:
 *       tags:
 *        - Approval
 *       summary: Atualize um Approval pelo ID.
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
 *                 approvalDate:
 *                   type: string
 *                 reprovedDate:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Approval atualizado com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Approval'
 *
 *     delete:
 *       tags:
 *        - Approval
 *       summary: Delete um Approval pelo ID.
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
 *           description: Approval deletado com sucesso.
 *
 *   /approvals/{id}/restore:
 *     put:
 *       tags:
 *        - Approval
 *       summary: Restaure um Approval pelo ID dentro de 7 dias após a exclusão.
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
 *           description: Approval restaurado com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Approval'
 *
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
 *           enum: [waiting_approval, approved, disapproved, deleted]
 *           required: true
 *           example: "waiting_approval"
 *         companyId:
 *           type: integer
 *         customerId:
 *           type: integer
 *         createdBy:
 *           type: integer
 *         approvalDate:
 *           type: string
 *         reprovedDate:
 *           type: string
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
 *         - approvalDate
 *         - reprovedDate
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
 *         approvalDate: "2023-10-21T11:30:00.000-03:00"
 *         reprovedDate: "2023-08-21T14:30:00.000-03:00"
 *         createdAt: "2023-06-21T13:30:00.000-03:00"
 *         updatedAt: "2023-12-21T15:45:00.000-03:00"
 */

export default class Approval extends compose(BaseModel, Filterable) {
  public static $filter = () => ApprovalFilter

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
  public status: 'waiting_approval' | 'approved' | 'disapproved' | 'deleted'

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

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public user: BelongsTo<typeof User>

  @hasMany(() => ApprovalItem)
  public approvalItems: HasMany<typeof ApprovalItem>

  @hasMany(() => File)
  public files: HasMany<typeof File>
}
