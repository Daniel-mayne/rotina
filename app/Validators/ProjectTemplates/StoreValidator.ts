import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.unique({
        table: 'project_templates',
        column: 'title',
        where: { company_id: this.refs.companyId },
      }),
    ]),
    projectTitle: schema.string({ trim: true }),
    projectDescription: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {
    required: 'O campo {{ field }} é obrigatório.',
  }
}
