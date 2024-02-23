import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    name: schema.string.optional({ trim: true }),
    logo: schema.string.optional({ trim: true }),
    status: schema.enum.optional(['active', 'deactivated', 'deleted'] as const),
    fillingPercentage: schema.number.optional(),
    userIds: schema.array
      .optional()
      .members(
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
    required: 'O campo {{ field }} é obrigatório.',
  }
}
