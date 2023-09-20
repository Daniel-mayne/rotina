import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { PersonaFilter } from './Filters'

{
  /**
  * @swagger
  * components:
  *   schemas: 
  *    Persona:  
  *       type: object
  *       properties:
  *         id:
  *           type: integer
  *           required: true
  *         name:
  *           type: string
  *           required: true
  *         description:
  *           type: string
  *         pains:
  *           type: string
  *         objections:
  *           type: string   
  *         companyId:
  *           type: integer
  *         customerId:
  *           type: integer
  *         createdAt:
  *           type: string
  *           format: datetime
  *         updatedAt:
  *           type: string
  *           format: datetime 
  *         required:
  *            - id
  *            - name 
  *         example:
  *            id: 1
  *            name: "Persona 1"
  *            description:  "Description 1"
  *            pains: "Pains 1"
  *            objections: "Objections"
  *            companyId:  3
  *            customerId: 10
  */

  /**
     @swagger
     * paths:
     *   /personas:
     *     get:
     *       tags:
     *        - Personas
     *       summary: Lista todas as Personas
     *       responses:
     *         '200':
     *           description: Lista de personas obtida com sucesso
     *           content:
     *             application/json:
     *               schema:
     *                 type: array
     *                 items:
     *                   $ref: '#/components/schemas/Persona'
     *     post:
     *       tags:
     *        - Personas
     *       summary: Cria uma nova Persona
     *       requestBody:
     *         required: true
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Persona'
     *       responses:
     *         '201':
     *           description: Persona criada com sucesso
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Persona'
          /personas/{id}:
     *     get:
     *       tags:
     *        - Personas
     *       summary: Obtém uma Persona por ID
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
     *           description: Persona obtida com sucesso
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Persona'
     *     put:
     *       tags:
     *        - Personas
     *       summary: Atualiza uma Persona por ID
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
     *                 description:
     *                   type: string
     *                 pains:
     *                   type: string
     *                 objections:
     *                   type: string
     *       responses:
     *         '200':
     *           description: Persona atualizada com sucesso
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Persona'
     *     delete:
     *       tags:
     *        - Personas
     *       summary: Deleta uma Persona por ID
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
     *           description: Persona deletada com sucesso
     */
}

export default class Persona extends compose(BaseModel, Filterable) {

  public static $filter = () => PersonaFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public pains: string

  @column()
  public objections: string

  @column()
  public companyId: number

  @column()
  public customerId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @hasMany(() => User)
  public users: HasMany<typeof User>
}



