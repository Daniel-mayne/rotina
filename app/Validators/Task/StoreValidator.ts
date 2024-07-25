import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) { }

  public refs = schema.refs({
    companyId: this.ctx.auth.user!.companyId,
  })

  public schema = schema.create({
    title: schema.string.optional({ trim: true }),
    taskDescription: schema.string.optional({ trim: true }),
    dueDate: schema.date.optional({ format: 'dd/MM/yyyy' }),
    estimatedTime: schema.date.optional({ format: 'dd/MM/yyyy HH:mm:ss' }),
    order: schema.number.optional(),
    status: schema.enum.optional([
      'waiting_approval',
      'approved',
      'disapproved',
      'deleted',
    ] as const),
    currentUserId: schema.number.optional([
      rules.exists({
        table: 'users',
        column: 'id',
        where: { company_id: this.refs.companyId },
      }),
    ]),
    clientId: schema.number.optional([
      rules.exists({
        table: 'customers',
        column: 'id',
        where: { company_id: this.refs.companyId },
      }),
    ]),
    taskTemplateId: schema.number.optional([
      rules.exists({
        table: 'task_templates',
        column: 'id',
        where: { company_id: this.refs.companyId },
      }),
    ]),
    projectId: schema.number.optional([
      rules.exists({
        table: 'projects',
        column: 'id',
        where: { company_id: this.refs.companyId },
      }),
    ]),
  })

  public messages: CustomMessages = {
    required: 'O campo {{ field }} é obrigatório.',
  }
}
