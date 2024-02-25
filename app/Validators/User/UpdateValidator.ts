import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    name: schema.string.optional({ trim: true }),
    phone: schema.string.optional({ trim: true }),
    email: schema.string.optional({ trim: true }, [rules.email()]),
    type: schema.enum.optional(['user', 'guest', 'administrator'] as const),
    status: schema.enum.optional(['active', 'deactivated'] as const),
    theme: schema.enum.optional(['white', 'black'] as const),
    password: schema.string.optional({ trim: true }, [
      rules.confirmed('passwordConfirmation'),
      rules.minLength(8),
    ]),
    oldPassword: schema.string.optional({ trim: true }, [rules.minLength(8)]),
    sendNotificationWhatsapp: schema.boolean.optional(),
    workStart: schema.date.optional({}),
    workEnd: schema.date.optional({}),
    lunchStart: schema.date.optional({}),
    lunchEnd: schema.date.optional({}),
    customerIds: schema.array.optional().members(
      schema.number.optional([
        rules.exists({
          table: 'customers',
          column: 'id',
          where: { company_id: this.refs.companyId },
        }),
      ])
    ),
    departmentIds: schema.array.optional().members(
      schema.number.optional([
        rules.exists({
          table: 'departments',
          column: 'id',
          where: { company_id: this.refs.companyId },
        }),
      ])
    ),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
    'phone.mobile': 'Insira um numero de telefone válido.',
    'email.email': 'Insira um email válido.',
  }
}
