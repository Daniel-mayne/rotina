import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: 'teams',
        column: 'name',
        where: { company_id: this.refs.companyId },
      }),
    ]),
    color: schema.string.optional({ trim: true }),
    logo: schema.string.optional({ trim: true }),
    description: schema.string.optional({ trim: true }),
    userIds: schema.array.optional().members(
      schema.number.optional([
        rules.exists({
          table: 'users',
          column: 'id',
          where: { company_id: this.refs.companyId },
        }),
      ])
    ),
  })

  public messages: CustomMessages = {
    required: 'O campo {{ field }} é obrigatório.',
  }
}
