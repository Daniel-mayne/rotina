import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, Approval, User, ApprovalItemFile, PostComment, Notification, Persona } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { ApprovalItemFilter } from './Filters'
/**
* @swagger
* paths:
*   /approvalItem:
*     get:
*       tags:
*        - ApprovalItem
*       summary: Liste todos os ApprovalItems
*       responses:
*         '200':
*           description: Lista de ApprovalItems obtida com sucesso.
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/ApprovalItem'
*
*     post:
*       tags:
*        - ApprovalItem
*       summary: Crie um novo ApprovalItem.
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/ApprovalItem'
*       responses:
*         '201':
*           description: ApprovalItem criado com sucesso.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/ApprovalItem'
*
*   /ApprovalItems/{id}:
*     get:
*       tags:
*        - ApprovalItem
*       summary: Obtenha um ApprovalItem por ID.
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
*           description: ApprovalItem obtido com sucesso.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/ApprovalItem'
*
*     put:
*       tags:
*        - ApprovalItem
*       summary: Atualize um ApprovalItem por ID.
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
*           description: ApprovalItem atualizado com sucesso.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/ApprovalItem'
*
*     delete:
*       tags:
*        - ApprovalItem
*       summary: Exclua um ApprovalItem por ID.
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
*           description: ApprovalItem excluído com sucesso.
*
*   /ApprovalItems/{id}/restore:
*     put:
*       tags:
*        - ApprovalItem
*       summary: Restaure um ApprovalItem pelo ID dentro de 7 dias após a exclusão.
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
*           description: ApprovalItem atualizada com sucesso
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/ApprovalItem'
*
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
*
*/
export default class ApprovalItem extends compose(BaseModel, Filterable) {

  public static $filter = () => ApprovalItemFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public text: string

  @column()
  public status: 'waiting_approval' | 'approved' | 'disapproved' | 'deleted'

  @column()
  public personaId: number

  @column()
  public approvalId: number

  @column()
  public createdBy: number

  @column()
  public companyId: number

  @column()
  public approvalBy: number

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

  @hasMany(() => PostComment)
  public postsComents: HasMany<typeof PostComment>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @hasMany(() => ApprovalItemFile)
  public files: HasMany<typeof ApprovalItemFile>

  @belongsTo(() => Approval)
  public approval: BelongsTo<typeof Approval>

  @belongsTo(() => Persona)
  public persona: BelongsTo<typeof Persona>


  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

}
