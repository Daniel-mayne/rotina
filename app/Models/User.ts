import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  afterCreate,
  BaseModel,
  belongsTo,
  BelongsTo,
  HasMany,
  hasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import {
  Company,
  Apikey,
  Customer,
  Persona,
  Approval,
  ApprovalItem,
  File,
  CustomerInformation,
  PostComment,
  Notification,
  ProjectTemplate,
  Department,
  Team,
} from 'App/Models'
import Encryption from '@ioc:Adonis/Core/Encryption'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { UserFilter } from './Filters'
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         name:
 *           type: string
 *           required: true
 *         email:
 *           type: string
 *           required: true
 *         password:
 *           type: string
 *           format: password
 *           required: true
 *         phone:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, deactivated]
 *           required: true
 *           example: active
 *         type:
 *           type: string
 *           enum: [user, guest, administrator]
 *           required: true
 *           example: user
 *         picture:
 *           type: string
 *         workLoad:
 *           type: datetime
 *         companyId:
 *           type: integer
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         apiKey:
 *           $ref: '#/components/schemas/Apikey'
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         persona:
 *           $ref: '#/components/schemas/Persona'
 *         approval:
 *           $ref: '#/components/schemas/Approval'
 *         file:
 *           $ref: '#/components/schemas/File'
 *         approvalItem:
 *           $ref: '#/components/schemas/ApprovalItem'
 *         company:
 *           $ref: '#/components/schemas/Company'
 *       required:
 *         - id
 *         - name
 *         - email
 *         - password
 *         - passwordConfirmation
 *         - status   [active, deactivated]
 *         - type  [user, guest, administrator]
 *         - companyId
 *       example:
 *         id: 1
 *         name: "Usuário Rotina 1"
 *         email:  "email@rotina.digital"
 *         password: "************"
 *         phone: "17999999999"
 *         status:  "active"
 *         type: "user"
 *         theme: "white"
 *         picture: "imagem string"
 *         workLoad: "08:00:00"
 *         companyId: 5
 *         createdAt: "2023-09-17T16:19:16.000-03:00"
 *         updatedAt: "2023-09-17T16:35:40.000-03:00"
 */
/**
   @swagger
   * paths:
   *   /users:
   *     get:
   *       tags:
   *        - User
   *       summary: Lista todos os usuários
   *       responses:
   *         '200':
   *           description: Lista de usuários obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/User'
   *     post:
   *       tags:
   *        - User
   *       summary: Cria um novo usuário
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       responses:
   *         '201':
   *           description: Usuário criado com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
   *   /users/{id}:
   *     get:
   *       tags:
   *        - User
   *       summary: Obtém um usuário por ID
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
   *           description: Usuário obtido com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
   *     put:
   *       tags:
   *        - User
   *       summary: Atualiza um usuário por ID
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
   *                 phone:
   *                   type: string
   *                 email:
   *                   type: string
   *                 type:
   *                   type: string
   *                 status:
   *                   type: string
   *                 theme:
   *                   type: string
   *                 password:
   *                   type: string
   *                 passwordConfirmation:
   *                   type: string
   *                 oldPassword:
   *                   type: string
   *       responses:
   *         '200':
   *           description: Usuário atualizado com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
   *     delete:
   *       tags:
   *        - User
   *       summary: Deleta um usuário por ID
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
   *           description: Usuário deletado com sucesso
   */
export default class User extends compose(BaseModel, Filterable) {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static $filter = () => UserFilter

  public serializeExtras = true
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public phone?: string

  @column()
  public email: string

  @column()
  public theme: 'white' | 'black'

  @column()
  public status: 'active' | 'deactivated' | 'deleted'

  @column()
  public type: 'user' | 'guest' | 'administrator' | 'owner'

  @column()
  public picture?: string

  @column.dateTime({
    serialize: (value?: DateTime) => {
      return value.toFormat('HH:mm:ss')
    },
  })
  public workLoad: DateTime

  @column()
  public rememberMeToken?: string

  @column()
  public companyId: number

  @column()
  public customerId: number

  @column()
  public departmentId: number

  @column()
  public teamId: number

  @column({
    serialize: (value?: Number) => {
      return Boolean(value)
    },
  })
  public sendNotificationWhatsapp?: boolean

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

  @hasMany(() => Apikey)
  public apiKeys: HasMany<typeof Apikey>

  @hasMany(() => Persona)
  public personas: HasMany<typeof Persona>

  @hasMany(() => Approval)
  public approvals: HasMany<typeof Approval>

  @hasMany(() => File)
  public files: HasMany<typeof File>

  @hasMany(() => ApprovalItem, {
    foreignKey: 'createdBy',
  })
  public approvalItems: HasMany<typeof ApprovalItem>

  @hasMany(() => PostComment)
  public postsComents: HasMany<typeof PostComment>

  @hasMany(() => Customer, {
    foreignKey: 'accountManagerId',
  })
  public customers: HasMany<typeof Customer>

  @hasMany(() => CustomerInformation)
  public customerInformations: HasMany<typeof CustomerInformation>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @hasMany(() => ProjectTemplate)
  public projectTemplates: HasMany<typeof ProjectTemplate>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @manyToMany(() => Customer)
  public customerUsers: ManyToMany<typeof Customer>

  @manyToMany(() => Department)
  public departments: ManyToMany<typeof Department>

  @manyToMany(() => Team)
  public teams: ManyToMany<typeof Team>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterCreate()
  public static async createApiKey(user: User) {
    await user.related('apiKeys').create({
      value: Encryption.encrypt({ id: user.id }),
      status: 'active',
      companyId: user.companyId,
      title: 'ApiKey',
    })
  }
}
