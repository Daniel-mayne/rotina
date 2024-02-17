import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    taskDescription: schema.string.optional({ trim: true }),
    clientId: schema.number.optional(),
    dueDate: schema.date.optional({ format: 'dd/MM/yyyy' }),
    estimatedTime: schema.date.optional({ format: 'dd/MM/yyyy' }),
    taskTempateId: schema.number.optional(),
    projectId: schema.number.optional(),
    initialUserId: schema.number.optional(),
  })

  public messages: CustomMessages = {
    required: 'O campo {{ field }} é obrigatório.',
  }
}
