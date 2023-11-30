import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) { }

  public refs = schema.refs({
    companyId : this.ctx.auth.user!.companyId,
  })
  

  public schema = schema.create({
    title: schema.string({ trim: true }),
    links: schema.string({ trim: true }),
    text: schema.string({ trim: true }),
    approvalId: schema.number([rules.exists({ table: 'approvals', column: 'id', where: { company_id: this.refs.companyId } })]),
    personaId: schema.number([rules.exists({ table: 'personas', column: 'id', where: { company_id: this.refs.companyId } })]),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
  }
}


