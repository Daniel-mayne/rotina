import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    taskTitle: schema.string({ trim: true }),
    taskDescription: schema.string({ trim: true }),
    deadlineDate: schema.date({ format: 'dd/MM/yyyy' }),
    estimatedTaskTime: schema.date({ format: 'dd/MM/yyyy' }),
  })

  public messages: CustomMessages = {
    required: 'O campo {{ field }} é obrigatório.',
  }
}
