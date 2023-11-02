import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    title: schema.string.optional({ trim: true }),
    text: schema.string.optional({ trim: true }),
    type: schema.enum.optional(['text', 'code', 'image'] as const),
    language: schema.string.optional({ trim: true }),
    status: schema.enum.optional(['active', 'deactivated'] as const),
    isValid: schema.boolean.optional()
  })

  public messages: CustomMessages = {
  }
}
