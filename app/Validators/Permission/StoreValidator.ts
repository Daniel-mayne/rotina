import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: 'permissions',
        column: 'name',
      }),
    ]),
  })

  public messages: CustomMessages = {
    required: 'O campo {{ field }} é obrigatório.',
  }
}
