import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { string } from '@ioc:Adonis/Core/Helpers'
import { File } from 'App/Models'
import { StoreValidator, StoreTemporaryValidator } from 'App/Validators/File'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'

export default class FilesController {
  public async index({ request, auth }: HttpContextContract) {
    const { limit = 10, page = 1, orderColumn = 'name', orderDirection = 'asc' } = request.qs()

    return await File.query()
      .where('company_id', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const fs = require('fs')

    const clientName = data.file.clientName
      .replace(`.${data.file.extname}`, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const name = `${clientName.replace(/\s/g, '_').replace('(', '_').replace(')', '_')}-${string.generateRandom(20)}.${
      data.file.extname
    }`
    const contentType = data.file.headers['content-type']
    const acl = 'public-read'

    await Drive.put(
      `company/${auth.user!.companyId}/${name}`,
      fs.createReadStream(data.file.tmpPath),
      {
        contentType,
        acl,
        'Content-Length': data.file.size,
      }
    )

    const file = await File.create({
      name: name.replace(`.${data.file.extname}`, ''),
      extension: data.file.extname,
      size: data.file.size,
      link: `${Env.get('S3_DOMAIN')}/company/${auth.user!.companyId}/${name}`,
      companyId: auth.user!.companyId,
      createdBy: auth.user!.id,
    })

    return file
  }

  public async temporaryStore({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreTemporaryValidator)
    const fs = require('fs')

    const clientName = data.file.clientName
      .replace(`.${data.file.extname}`, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const name = `${clientName.replace(/\s/g, '_')}-${string.generateRandom(20)}.${
      data.file.extname
    }`
    const contentType = data.file.headers['content-type']
    const acl = 'public-read'

    await Drive.put(`tmp/${name}`, fs.createReadStream(data.file.tmpPath), {
      contentType,
      acl,
      'Content-Length': data.file.size,
    })

    return {
      url: `${Env.get('S3_DOMAIN')}/tmp/${name}`,
      name,
    }
  }

  // public async show({ params, auth }: HttpContextContract) {
  //   const filter = await Filter.query()
  //     .where('id', params.id)
  //     .andWhere('company_id', auth.user!.companyId)
  //     .andWhere('user_id', auth.user!.id)
  //     .firstOrFail()

  //   await filter.load('pipe')
  //   await filter.load('user')
  //   return filter
  // }

  // public async update({ params, auth, request }: HttpContextContract) {
  //   const data = await request.validate(UpdateValidator)
  //   const trx = await Database.transaction()

  //   const filter = await Filter.query()
  //     .where('id', params.id)
  //     .andWhere('company_id', auth.user!.companyId)
  //     .firstOrFail()

  //   await filter.merge(data).save()

  //   await trx.commit()

  //   await filter.load('pipe')
  //   await filter.load('user')
  //   return filter
  // }

  // public async destroy({ params, auth }: HttpContextContract) {
  //   const trx = await Database.transaction()
  //   const filter = await Filter.query()
  //     .where('id', params.id)
  //     .andWhere('company_id', auth.user!.companyId)
  //     .andWhere('user_id', auth.user!.id)
  //     .firstOrFail()
  //   filter.delete()
  //   await trx.commit()
  //   return
  // }
}
