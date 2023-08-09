import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.unique({ table: 'companies', column: 'name' })]),
    smtpHost: schema.string.optional({ trim: true }),
    smtpPort: schema.string.optional({ trim: true }),
    smtpPassword: schema.string.optional({ trim: true }),
    adminName: schema.string({ trim: true }),
    adminEmail: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'email' })]),
    adminPassword: schema.string({ trim: true }),
    adminPhone: schema.string.optional({ trim: true }),
    refferName: schema.string.optional({ trim: true }),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório1.',
    'name.unique': 'Já existe uma empresa com esse nome.',
    'userLimit.range': 'O valor de {{ field }} precisa ser entre 1 e 500.',
    'adminEmail.unique': 'Já existe um usuário com esse email.',
  }
}
