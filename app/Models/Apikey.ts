import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { User, Company } from 'App/Models'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
/**
 * @swagger
 * paths:
 *   /apiKeys:
 *     post:
 *       tags:
 *         - Apikey
 *       summary: Cria uma nova ApiKey
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apikey'
 *       responses:
 *         '201':
 *           description: ApiKey criada com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Apikey'
 *   /apiKeys/{id}:
 *     put:
 *       tags:
 *        - Apikey
 *       summary: Atualiza um ApiKey por ID
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
 *                 userId:
 *                   type: integer
 *                 companyId:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 status:
 *                   type: string
 *                 value:
 *                   type: string
 *       responses:
 *         '200':
 *           description: ApiKey atualizado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Apikey'
 *     delete:
 *       tags:
 *        - Apikey
 *       summary: Deleta uma ApiKey por ID
 *       parameters:
 *         - in : path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *             minimum: 1
 *       responses:
 *         '204':
 *           description: ApiKey deletada com sucesso
 *
 *
 * components:
 *   schemas:
 *     Apikey:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         value:
 *           type: string
 *           required: true
 *         title:
 *           type: string
 *         companyId:
 *           type: integer
 *         userId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, deactivated]
 *           required: true
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         user:
 *           $ref: '#/components/schemas/User'
 *       required:
 *         - id
 *         - value
 *         - title
 *         - companyId
 *         - userId
 *         - status
 *         - createdAt
 *         - updatedAt
 *       example:
 *         id: 179
 *         value: "Q7XHTAC3YbmrZDdfd/*JZW5hUWv-vi-hV1GpbbN5jAUmFYuY.STI4SG9VT2FzX0lLUmhiRA.S9-BxJoSmrhENuEUBCwVKzooa59t2zP9uaqwSUbhl5Ysdfdfgdtggdfgfgdr"
 *         title: "ApiKey"
 *         userId: 10
 *         companyId: 456
 *         status: "active"
 *         createdAt: "30/10/2023 20:05:15"
 *         updatedAt: "30/10/2023 20:05:15"
 */

export default class Apikey extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  public id: number

  @column()
  public value: string

  @column()
  public title: string

  @column()
  public companyId: number

  @column()
  public userId: number

  @column()
  public status: 'active' | 'deactivated'

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
