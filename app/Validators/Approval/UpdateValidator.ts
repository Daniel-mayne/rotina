import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
    constructor(protected ctx: HttpContextContract) { }

    public schema = schema.create({
        name: schema.string.optional({ trim: true }),
        status: schema.enum.optional(['Awaiting approval', 'Approved', 'Denied', 'Deleted'] as const)
    })

    public messages: CustomMessages = {
    }
}
