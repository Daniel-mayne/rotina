import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    title: schema.string.optional({ trim: true }, [rules.minLength(4)]),
    description: schema.object.optional().anyMembers(),
    customerId: schema.number.optional([
      rules.exists({
        table: 'customers',
        column: 'id',
        where: { company_id: this.refs.companyId },
      }),
    ]),
    userIds: schema.array.optional().members(
      schema.number([
        rules.exists({
          table: 'users',
          column: 'id',
          where: { company_id: this.refs.companyId },
        }),
      ])
    ),
  })

  public messages: CustomMessages = {
    'title.minLength': 'O campo {{ field }} é obrigatório.',
  }
}
