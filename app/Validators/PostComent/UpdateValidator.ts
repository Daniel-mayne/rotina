import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
    constructor(protected ctx: HttpContextContract) { }

    public schema = schema.create({
        text: schema.string.optional({ trim: true }),
    })

    public messages: CustomMessages = {
    }
}