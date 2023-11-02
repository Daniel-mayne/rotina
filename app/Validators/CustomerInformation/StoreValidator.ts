import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    title: schema.string({ trim: true }),
    text: schema.string({ trim: true }),
    type: schema.enum(['text', 'code', 'image'] as const),
    language: schema.string.optional({ trim: true }),
    status: schema.enum.optional(['active', 'deactivated'] as const),
    isValid: schema.boolean.optional(),
    customerId: schema.number()
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
  }
}