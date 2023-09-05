import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Feed, Persona, User } from 'App/Models'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import Customer from './Customer'

export default class Company extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public smtpHost?: string

  @column()
  public smtpPort?: string

  @column()
  public smtpPassword?: string

  @column()
  public userLimit?: number

  @column()
  public refferName?: string

  @column()
  public status?: 'active' | 'deactivated' | 'waiting_activation'

  @column()
  public stripeSubscriptionStatus?: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing'

  @column()
  public stripeSubscriptionId?: string

  @column()
  public stripeCustomerId?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @hasMany(()=> Customer)
  public customers: HasMany<typeof Customer>

  @hasMany(()=> Feed)
  public feeds: HasMany<typeof Feed>

  @hasMany(()=> Persona)
  public personas: HasMany<typeof Persona>

}
