import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class RecoveryPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.exists({ table: 'users', column: 'email' })
    ]),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'email.exists': 'Email não cadastrado.',
  }
}
