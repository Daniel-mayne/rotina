import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { Customer, User, Company } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { CustomerFilter } from './Filters'
/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerInformation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         title:
 *           type: string
 *           required: true
 *         type:
 *           type: string
 *           enum: [text, code, image]
 *           required: true
 *           example: "active"
 *         language:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, deactivated]
 *           required: true
 *           example: "active"
 *         isValid:
 *           type: boolean
 *         companyId:
 *           type: integer
 *           required: true
 *         customerId:
 *           type: integer
 *           required: true
 *         createdBy:
 *           type: integer
 *           required: true
 *         updateBy:
 *           type: integer
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         user:
 *           $ref: '#/components/schemas/User'
 *       required:
 *         - id
 *         - title
 *         - type
 *         - status
 *         - companyId
 *         - customerId
 *         - createdBy
 *       example:
 *         id: 1
 *         title: "Hospedagem"
 *         text: "Acesso"
 *         type: "code"
 *         language: "php"
 *         status: "active"
 *         isValid: true
 *         companyId: 3
 *         customerId: 5
 *         createdBy: 4
 *         updateBy: 5
 *         createdAt: "2023-09-21T14:30:00.000-03:00"
 *         updatedAt: "2023-09-21T15:45:00.000-03:00"
 */
/**
   @swagger
   * paths:
   *   /customerInformation:
   *     get:
   *       tags:
   *        - CustomerInformation
   *       summary: Lista todas as customer informations
   *       responses:
   *         '200':
   *           description: Lista de customer informations obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/CustomerInformation'
   *     post:
   *       tags:
   *        - CustomerInformation
   *       summary: Cria uma nova customer information
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CustomerInformation'
   *       responses:
   *         '201':
   *           description: Customer information criado com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CustomerInformation'
   *   /customerInformation/{id}:
   *     get:
   *       tags:
   *        - CustomerInformation
   *       summary: Obtém um customer information por ID
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
   *           description: Customer information obtido com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CustomerInformation'
   *     put:
   *       tags:
   *        - CustomerInformation
   *       summary: Atualiza uma customer information por ID
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
   *                 title:
   *                   type: string
   *                 text:
   *                   type: string
   *                 type:
   *                   type: string
   *                 language:
   *                   type: string
   *                 status:
   *                   type: string
   *                 isValid:
   *                   type: boolean
   *                 updateBy:
   *                   type: integer
   *       responses:
   *         '200':
   *           description: Customer information atualizada com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CustomerInformation'
   *     delete:
   *       tags:
   *        - CustomerInformation
   *       summary: Deleta uma customer information por ID
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
   *           description: Customer information deletado com sucesso
   */
export default class CustomerInformation extends compose(BaseModel, Filterable) {
  public static $filter = () => CustomerFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public text: string

  @column()
  public type: 'text' | 'code' | 'image'

  @column()
  public language: string

  @column()
  public status?: 'active' | 'deactivated'

  @column()
  public isValid: boolean

  @column()
  public companyId: number


  @column()
  public customerId: number

  @column()
  public createdBy: number

  @column()
  public updateBy: number

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
  public updatedAt: DateTime;

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
