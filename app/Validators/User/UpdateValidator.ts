import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }),
    phone: schema.string.optional({ trim: true }),
    email: schema.string.optional({ trim: true }, [rules.email()]),
    type: schema.enum.optional(['user', 'administrator'] as const),
    status: schema.enum.optional(['active', 'deactivated'] as const),
    defaultPipe: schema.number.optional([rules.exists({ table: 'pipes', column: 'id' })]),
    password: schema.string.optional({ trim: true }, [
      rules.confirmed('passwordConfirmation'),
      rules.minLength(12),
    ]),
    sendNotificationWhatsapp: schema.boolean.optional()
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'phone.mobile': 'Insira um numero de telefone válido.',
    'email.email': 'Insira um email válido.',
    'defaultPipe.exists': 'Esse funil não existe.',
  }
}
