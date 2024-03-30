import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    title: schema.string.optional({ trim: true }),
    description: schema.object.optional().anyMembers(),
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

  public messages: CustomMessages = {}
}
