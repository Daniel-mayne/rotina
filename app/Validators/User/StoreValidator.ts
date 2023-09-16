import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: schema.string({ trim: true }),
    password: schema.string({ trim: true }, [
      rules.confirmed('passwordConfirmation'),
      rules.minLength(12),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    phone: schema.string({ trim: true }, [rules.mobile({ locale: ['pt-BR'] })]),
    type: schema.enum(['user', 'guest', 'administrator'] as const),
    theme: schema.enum.optional(['white', 'black'] as const),
    workStart: schema.date.optional({ }),
    workEnd: schema.date.optional({ }),
    lunchStart: schema.date.optional({}),
    lunchEnd: schema.date.optional({}),
    workLoad: schema.date.optional({})
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'password.confirmed': 'As senhas não são iguais.',
    'phone.mobile': 'Insira um numero de telefone válido.',
    'email.email': 'Insira um email válido.',
    'email.unique': 'Email já cadastrado.',
    'workStart.date': 'O campo workLoad deve estar no formato HH:mm:ss',
    'workEnd.date': 'O campo workLoad deve estar no formato HH:mm:ss',
    'lunchStart.date': 'O campo workLoad deve estar no formato HH:mm:ss',
    'lunchEnd.date': 'O campo workLoad deve estar no formato HH:mm:ss',
  }
}
