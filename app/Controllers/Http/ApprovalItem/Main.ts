import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApprovalItem, ApprovalItemFile, File } from 'App/Models'
import { StoreValidator, UpdateValidator, StoreTemporaryValidator } from 'App/Validators/ApprovalItem'
import { DateTime } from 'luxon'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class ApprovalItemsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'title',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await ApprovalItem.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('approval')
      .preload('postsComents')
      .preload('user')
      .paginate(page, limit)
  }




  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const approvalItem = await new ApprovalItem()
      .merge({ ...data, createdBy: auth.user!.id, companyId: auth.user!.companyId, approvalId: data.approvalId, status: 'waiting_approval' })
      .save()


    const fileData = await request.validate(StoreTemporaryValidator)

    const fs = require('fs')

    const originalFileName = fileData.file?.clientName
      .replace(`.${fileData.file.extname}`, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const newName = `${originalFileName?.replace(/\s/g, '-')}-${string.generateRandom(5)}.${fileData.file?.extname}`
    const contentType = fileData.file?.headers['content-type']
    const acl = 'public'

    await Drive.put(`companies/${auth.user!.id}/tmp/uploads/${newName}`, fs.createReadStream(fileData.file?.tmpPath), {
      contentType,
      acl,
      'Content-Length': fileData.file.size,
    });

    const sourcePath = `companies/${auth.user!.id}/tmp/uploads/${newName}`


    const destinationPath = `companies/${auth.user!.companyId}/approvals/${data.approvalId}/items/${approvalItem.id}/${newName}`

    await Drive.move(sourcePath, destinationPath)
    const updatedUrl = `${Env.get('S3_DOMAIN')}/${destinationPath}`


    const file = await new File()
      .merge({  companyId: auth.user!.companyId, createdBy: auth.user!.id, link: updatedUrl, extension: fileData.file?.extname, name:newName  })
      .save()

    const approvalItemFile = await new ApprovalItemFile()
      .merge({ approvalItemId: approvalItem.id, fileId: file.id  })
      .save()

    await approvalItem.load(loader => {
      loader.preload('approval')
    })
   

    return { approvalItem, approvalItemFile }
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('approval')
      .preload('postsComents')
      .firstOrFail()

    return data

  }

 


  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const approvalItem = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await approvalItem.merge({
      ...data,
      approvalBy: data.status === 'approved' || data.status === 'disapproved' ? auth.user!.id : undefined,
      approvalDate: data.status === 'approved' ? DateTime.now().setZone() : approvalItem.approvalDate,
      reprovedDate: data.status === 'disapproved' ? DateTime.now().setZone() : approvalItem.reprovedDate,
    }).save()

    await approvalItem.load(loader => {
      loader.preload('approval')
    })

    return approvalItem

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    return await data.delete()
  }
}


