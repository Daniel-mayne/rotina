import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    title: schema.string.optional({ trim: true }),
    projectDescription: schema.string.optional({ trim: true }),
    estimatedDelivery: schema.date.optional({ format: 'dd/MM/yyyy' })
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',

  }
}
