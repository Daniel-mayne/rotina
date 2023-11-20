
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreTemporaryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file.optional({
      size: '500mb',
      extnames: [
        'jpg',
        'png',
        'jpeg',
        'png',
        'gif',
        'pdf',
        'mp4',
        'MP4',
        'xls',
        'doc',
        'docx',
        'xlsx',
        'csv',
        'zip'
      ],
    }),
  })

  public messages = {}
}
