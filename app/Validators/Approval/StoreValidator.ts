import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
    constructor(protected ctx: HttpContextContract) { }

    public refs = schema.refs({
        companyId: this.ctx.auth.user!.companyId,
    })

    public schema = schema.create({
        name: schema.string({ trim: true }),
        customerId: schema.number([rules.exists({ table: 'customers', column: 'id', where: { company_id: this.refs.companyId } })])
    })

    public messages: CustomMessages = {
        'required': 'O campo {{ field }} é obrigatório.',
    }
}


