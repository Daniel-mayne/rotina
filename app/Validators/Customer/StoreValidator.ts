import { schema, CustomMessages} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: schema.string({ trim: true }),
    logo: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
  }
}
