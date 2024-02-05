import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    title: schema.string.optional({ trim: true }),
    type: schema.enum.optional(['whatsapp', 'call', 'not_answer', 'mail', 'meeting'] as const),
    status: schema.enum.optional(['open', 'completed'] as const),
    start: schema.string.optional({ trim: true }),
    end: schema.string.optional({ trim: true }),
    annotation: schema.string.optional({ trim: true }),
    userId: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'userId.exists': 'Usuário {{ options }} não existe.',
  }
}
