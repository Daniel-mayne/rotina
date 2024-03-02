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
        table: 'permissions',
        column: 'name',
        where: { company_id: this.refs.companyId },
      }),
    ]),
    departmentIds: schema.array.optional().members(
      schema.number([
        rules.exists({
          table: 'departments',
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
