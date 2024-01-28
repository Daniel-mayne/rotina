import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '500mb',
      extnames: [
        'jpg',
        'jpeg',
        'gif',
        'pdf',
        'mp4',
        'MP4',
        'xls',
        'doc',
        'docx',
        'xlsx',
        'csv',
      ],
    }),
  })

  public messages: CustomMessages = {
    'required': 'O campo {{ field }} é obrigatório.',
  }
}
