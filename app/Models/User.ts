import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  afterCreate,
  BaseModel,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { Pipe, Company, Apikey, Deal, Activity } from 'App/Models'
import { search } from 'adosearch'
import Encryption from '@ioc:Adonis/Core/Encryption'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            required: true
 *          name:
 *            type: string
 *            required: true
 *          email:
 *            type: string
 *            required: true
 *          password:
 *            type: string
 *            format: password
 *            required: true
 *          phone:
 *            type: string
 *          status:
 *            type: string
 *            enum: [active, deactivated]
 *            required: true
 *            example: active
 *          type:
 *            type: string
 *            enum: [user, administrator]
 *            required: true
 *            example: user
 *          companyId:
 *            type: integer
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *          pipeDefault:
 *            $ref: '#/components/schemas/Pipe'
 *          apiKey:
 *            $ref: '#/components/schemas/Apikey'
 *          pipes:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Pipe'
 *          company:
 *            $ref: '#/components/schemas/Company'
 *          deals:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Deal'
 *          activities:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Activity'
 */

export default class User extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  public static search = search(this, ['name', 'phone', 'status', 'email', 'type'])

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
  public status: 'active' | 'deactivated'

  @column()
  public type: 'user' | 'administrator' | 'owner'

  @column()
  public picture?: string

  @column()
  public defaultPipe?: number

  @column()
  public rememberMeToken?: string

  @column()
  public companyId: number

  @column({
    serialize: (value?: Number) => {
      return Boolean(value)
    },
  })
  public sendNotificationWhatsapp?: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Pipe)
  public pipeDefault: HasOne<typeof Pipe>

  @hasMany(() => Apikey)
  public apiKeys: HasMany<typeof Apikey>

  @manyToMany(() => Pipe, {
    pivotColumns: ['splitter', 'count'],
  })
  public pipes: ManyToMany<typeof Pipe>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @hasMany(() => Deal)
  public deals: HasMany<typeof Deal>

  @hasMany(() => Activity)
  public activities: HasMany<typeof Activity>

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
      title: 'ApiKey'
    })

  }
}
