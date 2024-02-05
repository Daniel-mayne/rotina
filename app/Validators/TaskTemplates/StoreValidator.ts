import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({

  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',

  }
}