import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
    constructor(protected ctx: HttpContextContract) { }

    public schema = schema.create({
        name: schema.string({ trim: true }),
        status: schema.enum(['waiting_approval', 'approved', 'disapproved'] as const),
    })

    public messages: CustomMessages = {
    }
}
