import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class DeleteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
  }
}
