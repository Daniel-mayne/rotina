import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo} from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { PersonaFilter } from './Filters'
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
*           required: true
*         customerId:
*           type: integer
*           required: true
*         createdAt:
*           type: datetime
*           format: datetime
*         updatedAt:
*           type: datetime
*           format: datetime 
*         company:
*           $ref: '#/components/schemas/Company'
*         customer:
*           $ref: '#/components/schemas/Customer'
*         user:
*           $ref: '#/components/schemas/User'
*       required:
*          - id
*          - name 
*          - companyId 
*          - customerId 
*       example:
*          id: 2
*          name: "Persona 2"
*          description: "Descrição da Persona 2"
*          pains: "Principais Desafios da Persona 2"
*          objections: "Objetivos da Persona 2"
*          companyId: 5
*          customerId: 8
*          createdAt: "2023-09-21T09:45:00.000-03:00"
*          updatedAt: "2023-09-21T10:55:00.000-03:00"
*/
/**
* @swagger
* paths:
*   /personas:
*     get:
*       tags:
*        - Personas
*       summary: Listar Todas as Personas
*       description: Retorna uma lista de todas as personas cadastradas.
*       responses:
*         '200':
*           description: Lista de personas obtida com sucesso.
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Persona'
*     post:
*       tags:
*        - Personas
*       summary: Criar uma Nova Persona
*       description: Cria uma nova persona com base nos dados fornecidos.
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Persona'
*       responses:
*         '201':
*           description: Persona criada com sucesso.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Persona'
*   /personas/{id}:
*     get:
*       tags:
*        - Personas
*       summary: Obter uma Persona por ID
*       description: Retorna uma persona com base no ID fornecido.
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
*           description: Persona obtida com sucesso.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Persona'
*     put:
*       tags:
*        - Personas
*       summary: Atualizar uma Persona por ID
*       description: Atualiza uma persona com base no ID fornecido.
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
*           description: Persona atualizada com sucesso.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Persona'
*     delete:
*       tags:
*        - Personas
*       summary: Deletar uma Persona por ID
*       description: Deleta uma persona com base no ID fornecido.
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
*           description: Persona deletada com sucesso.
*           
* components:
*   schemas:
*     Persona:
*       type: object
*       properties:
*         id:
*           type: integer
*           format: int64
*           description: Identificador único da Persona.
*         name:
*           type: string
*           description: Nome da Persona.
*         description:
*           type: string
*           description: Descrição da Persona.
*         pains:
*           type: string
*           description: Pontos de dor da Persona.
*         objections:
*           type: string
*           description: Objeções da Persona.
*/
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

  @column()
  public status?: 'active' | 'deactivated'

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
}



