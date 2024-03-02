import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({ trim: true }),
    taskDescription: schema.string.optional({ trim: true }),
    dueDate: schema.date.optional({ format: 'dd/MM/yyyy' }),
    estimatedTime: schema.date.optional({ format: 'dd/MM/yyyy HH:mm:ss' }),
  })

  public messages: CustomMessages = {
    required: 'O campo {{ field }} é obrigatório.',
  }
}
