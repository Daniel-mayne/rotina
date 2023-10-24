import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { File } from 'App/Models'
import { StoreValidator } from 'App/Validators/File'
import Drive from '@ioc:Adonis/Core/Drive'
import { string } from '@ioc:Adonis/Core/Helpers'
import Env from '@ioc:Adonis/Core/Env'

export default class FilesController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await File.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth }) {
    const fileData = await request.validate(StoreValidator)
    const fs = require('fs')

    const fileName = fileData.file.clientName
      .replace(`.${fileData.file.extname}`, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const name = `${fileName.replace(/\s/g, '-')}-${string.generateRandom(5)}.${fileData.file.extname}`
    const contentType = fileData.file.headers['content-type']
    const acl = 'public'

    await Drive.put(`companies/${auth.user!.id}/tmp/uploads/${name}`, fs.createReadStream(fileData.file.tmpPath), {
      contentType,
      acl,
      'Content-Length': fileData.file.size,
    })

    const url = `${Env.get('S3_DOMAIN')}/companies/${auth.user!.id}/tmp/uploads/${name}`

    return {
      url,
      name
    }
  }
}
