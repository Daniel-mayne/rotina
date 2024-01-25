import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
    constructor(protected ctx: HttpContextContract) { }
    
    public refs = schema.refs({
        companyId : this.ctx.auth.user!.companyId,
      })

    public schema = schema.create({
        title: schema.string.optional({ trim: true }),
        links: schema.array.nullableAndOptional().members(schema.string()),
        approvalId: schema.number.optional([rules.exists({ table: 'approvals', column: 'id', where: { company_id: this.refs.companyId } })]),
        // personaId: schema.number.optional([rules.exists({ table: 'personas', column: 'id', where: { company_id: this.refs.companyId } })]),    
        text: schema.string.optional({ trim: true }),
        status: schema.enum.optional(['waiting_approval', 'approved', 'disapproved'] as const)
    })

    public messages: CustomMessages = {
    }
}
