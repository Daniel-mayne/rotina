import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) { }

  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
    customerId: this.ctx.auth.user!.customerId,
  })


  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.unique({ table: 'projects', column: 'title', where: { customer_id: this.refs.customerId } })]),
    projectDescription: schema.string({ trim: true }),
    projectTemplateId: schema.number(),
    customerId: schema.number(),
    estimatedDelivery: schema.date(),

  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',

  }
}
