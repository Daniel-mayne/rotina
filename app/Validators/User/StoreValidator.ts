import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    name: schema.string({ trim: true }),
    password: schema.string({ trim: true }, [
      rules.confirmed('passwordConfirmation'),
      rules.minLength(8),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    phone: schema.string({ trim: true }, [rules.mobile({ locale: ['pt-BR'] })]),
    type: schema.enum(['user', 'guest', 'administrator'] as const),
    theme: schema.enum.optional(['white', 'black'] as const),
    workLoad: schema.date.optional({}),
    departmentIds: schema.array.optional().members(
      schema.number.optional([
        rules.exists({
          table: 'departments',
          column: 'id',
          where: { company_id: this.refs.companyId },
        }),
      ])
    ),
    teamIds: schema.array.optional().members(
      schema.number.optional([
        rules.exists({
          table: 'teams',
          column: 'id',
          where: { company_id: this.refs.companyId },
        }),
      ])
    ),
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
