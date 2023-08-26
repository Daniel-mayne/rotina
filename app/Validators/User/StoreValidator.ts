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
    phone: schema.string.optional({ trim: true }, [rules.mobile({ locale: ['pt-BR'] })]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    type: schema.enum(['user', 'guest', 'administrator'] as const),
    workStart: schema.date(),
    workEnd: schema.date(),
    lunchStart: schema.date(),
    lunchEnd: schema.date()
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'password.confirmed': 'As senhas não são iguais.',
    'phone.mobile': 'Insira um numero de telefone válido.',
    'email.email': 'Insira um email válido.',
    'email.unique': 'Email já cadastrado.',
  }
}
