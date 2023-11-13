import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
    constructor(protected ctx: HttpContextContract) { }
    
    public refs = schema.refs({
        companyId : this.ctx.auth.user!.companyId,
      })

    public schema = schema.create({
        title: schema.string.optional({ trim: true }),
        text: schema.string.optional({ trim: true }),
        status: schema.enum.optional(['waiting_approval', 'approved', 'disapproved'] as const)
    })

    public messages: CustomMessages = {
    }
}
