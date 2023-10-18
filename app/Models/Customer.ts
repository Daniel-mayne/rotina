import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, User, Persona, Approval } from 'App/Models'
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
 *         approval:
 *           $ref: '#/components/schemas/Approval'
 *       required:
 *         - id
 *         - name
 *         - status
 *         - companyId
 *         - createdBy
 *         - accountManagerId
 *         - fillingPercentage
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
/**
   @swagger
   * paths:
   *   /customers:
   *     get:
   *       tags:
   *        - Customer
   *       summary: Lista todos os customers
   *       responses:
   *         '200':
   *           description: Lista de customers obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Customer'
   *     post:
   *       tags:
   *        - Customer
   *       summary: Cria um novo customer
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Customer'
   *       responses:
   *         '201':
   *           description: Customer criado com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Customer'
   *   /customers/{id}:
   *     get:
   *       tags:
   *        - Customer
   *       summary: Obtém um customer por ID
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
   *           description: Customer obtido com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Customer'
   *     put:
   *       tags:
   *        - Customer
   *       summary: Atualiza um customer por ID
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
   *                 logo:
   *                   type: string
   *                 status:
   *                   type: string
   *                 fillingPercentage:
   *                   type: integer
   *       responses:
   *         '200':
   *           description: Customer atualizado com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Customer'
   *     delete:
   *       tags:
   *        - Customer
   *       summary: Deleta um customer por ID
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
   *           description: Customer deletado com sucesso
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

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  @hasMany(() => Persona)
  public personas: HasMany<typeof Persona>

  @hasMany(() => Approval)
  public approvals: HasMany<typeof Approval>

}
