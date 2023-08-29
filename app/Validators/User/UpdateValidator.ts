import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }),
    phone: schema.string.optional({ trim: true }),
    email: schema.string.optional({ trim: true }, [rules.email()]),
    type: schema.enum.optional(['user', 'guest', 'administrator'] as const),
    status: schema.enum.optional(['active', 'deactivated'] as const),
    password: schema.string.optional({ trim: true }, [
      rules.confirmed('passwordConfirmation'),
      rules.minLength(12),
    ]),
    sendNotificationWhatsapp: schema.boolean.optional(),
    workStart: schema.date.optional({}, [rules.trim]),
    workEnd: schema.date.optional({}, [rules.trim]),
    lunchStart: schema.date.optional({}, [rules.trim]),
    lunchEnd: schema.date.optional({}, [rules.trim])
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'phone.mobile': 'Insira um numero de telefone válido.',
    'email.email': 'Insira um email válido.',
    'defaultPipe.exists': 'Esse funil não existe.',
  }
}
