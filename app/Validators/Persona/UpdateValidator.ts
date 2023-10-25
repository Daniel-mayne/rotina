import { schema, CustomMessages} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
    constructor(protected ctx: HttpContextContract) { }

    public schema = schema.create({
        name: schema.string.optional({ trim: true }),
        description: schema.string.optional({ trim: true }),
        pains: schema.string.optional({ trim: true }),
        status: schema.enum.optional(['active', 'deactivated'] as const),
        objections: schema.string.optional()
    })

    public messages: CustomMessages = {
    }
}
