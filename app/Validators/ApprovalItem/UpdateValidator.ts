import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
    constructor(protected ctx: HttpContextContract) { }

    public schema = schema.create({
        title: schema.string.optional({ trim: true }),
        text: schema.string.optional({ trim: true }),
        status: schema.enum.optional(['waiting_approval', 'approved', 'disapproved'] as const)
    })

    public messages: CustomMessages = {
    }
}
