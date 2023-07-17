import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }),
    smtpHost: schema.string.optional({ trim: true }),
    smtpPort: schema.string.optional({ trim: true }),
    smtpPassword: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'id.exists': 'Essa empresa não existe.',
  }
}
