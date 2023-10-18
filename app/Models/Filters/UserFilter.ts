import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>
  public static dropId: boolean = true
  public static camelCase: boolean = true

  public search(word: string): void {
    this.$query.andWhereRaw("(name LIKE ? OR email LIKE ? OR phone LIKE ?)", [`%${word}%`, `%${word}%`, `%${word}%`])
  }

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public name(name: string): void {
    this.$query.whereLike('name', `%${name}%`)
  }

  type(types: string) {
    this.$query.whereIn('type', types.split(','))
  }

  phone(phone: string) {
    this.$query.whereLike('phone', `${phone}`)
  }

  email(email: string) {
    this.$query.whereLike('email', `${email}`)
  }

  createdAt(value: string) {
    const dates: string[] = value.split(',')
    const firstDate = DateTime.fromFormat(dates[0]!, 'dd/MM/yyyy').startOf('day').toSQL()
    const seccondDate = dates[1]
      ? DateTime.fromFormat(dates[1], 'dd/MM/yyyy').endOf('day').toSQL()
      : DateTime.fromFormat(dates[0]!, 'dd/MM/yyyy').endOf('day').toSQL()
    this.$query.whereBetween('created_at', [firstDate!, seccondDate!])
  }
}
