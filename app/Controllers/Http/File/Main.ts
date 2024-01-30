import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { File } from 'App/Models'
import { StoreValidator, DeleteValidator } from 'App/Validators/File'
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

  public async temporaryStore({ request, auth }) {
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

    const data = await new File()
      .merge({
        name: name,
        extension: fileData.file.extname,
        size: fileData.file.size,
        link: url,
        companyId: auth.user!.companyId,
        createdBy: auth.user!.id,
      })
      .save()

    return data

  }


  public async destroy({ request, auth }: HttpContextContract) {
    const data = await request.validate(DeleteValidator)
    const file = await File.query()
      .where('link', data.file)
      .andWhere('company_id', auth.user!.companyId)
      .if(auth.user!.type !== "administrator", query => query.where('created_by', auth.user!.id))
      .firstOrFail()

      const fileReplace = data.file.replace(Env.get('S3_DOMAIN'), '').replace(/^\//, '')

    if (await Drive.exists(fileReplace)) {
      await Drive.delete(fileReplace)
      return await file.delete()
    }



  }

}
