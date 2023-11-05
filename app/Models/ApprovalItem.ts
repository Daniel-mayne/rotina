import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, Approval, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ApprovalItemFilter } from './Filters'
  /**
 * @swagger
 * components:
 *   schemas:
 *     ApprovalItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         name:
 *           type: string
 *           required: true
 *         ApprovalItemDate:
 *           type: string
 *           format: datetime
 *         status:
 *           type: string
 *           enum: [waiting_approval, approved, disapproved]
 *           required: true
 *           example: waiting_approval
 *         approvalId:
 *           type: integer
 *         createdBy:
 *           type: integer
 *         companyId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: datetime
 *         updatedAt:
 *           type: string
 *           format: datetime
 *         approval:
 *           $ref: '#/components/schemas/Approval'
 *         user:
 *           $ref: '#/components/schemas/User'
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         company:
 *           $ref: '#/components/schemas/Company'
 *       required:
 *         - id
 *         - name
 *         - status
 *         - approvalItemDate
 *         - approvalId
 *         - createdBy
 *         - companyId
 *       example:
 *         id: 1
 *         name: "ApprovalItem 1"
 *         ApprovalItemDate: "2023-09-17T17:47:22.318-03:00"
 *         status: "waiting_approval"
 *         approvalId: 123
 *         createdBy: 456
 *         companyId: 789
 */

  /**
   * @swagger
   * paths:
   *   /approvalItem:
   *     get:
   *       tags:
   *        - ApprovalItem
   *       summary: Lista todas as approvalItem
   *       responses:
   *         '200':
   *           description: Lista de approvalItem obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/ApprovalItem'
   *     post:
   *       tags:
   *        - ApprovalItem
   *       summary: Cria uma nova approvalItem
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApprovalItem'
   *       responses:
   *         '201':
   *           description: ApprovalItem criada com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ApprovalItem'
   *   /ApprovalItems/{id}:
   *     get:
   *       tags:
   *        - ApprovalItem
   *       summary: Obtém uma approvalItem por ID
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
   *           description: ApprovalItem obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ApprovalItem'
   *     put:
   *       tags:
   *        - ApprovalItem
   *       summary: Atualiza uma approvalItem por ID
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
   *                 status:
   *                   type: string
   *       responses:
   *         '200':
   *           description: ApprovalItem atualizada com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/ApprovalItem'
   *     delete:
   *       tags:
   *        - ApprovalItem
   *       summary: Deleta uma approvalItem por ID
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
   *           description: ApprovalItem deletada com sucesso
   */
export default class ApprovalItem extends compose(BaseModel, Filterable) {

  public static $filter = () => ApprovalItemFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public status: 'waiting_approval' | 'approved' | 'disapproved'

  @column()
  public approvalId: number

  @column()
  public createdBy: number

  @column()
  public companyId: number

  @column.dateTime({
    serialize: (value: DateTime) => {
      return value
    }
  })
  public approvalItemDate: DateTime

  @column.dateTime({ 
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    }, })
  public createdAt: DateTime

  @column.dateTime({ 
    autoCreate: true, 
    autoUpdate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    },
   })
  public updatedAt: DateTime

  @belongsTo(() => Approval)
  public approval: BelongsTo<typeof Approval>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>
}
