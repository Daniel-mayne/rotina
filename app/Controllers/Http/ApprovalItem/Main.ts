import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApprovalItem, File } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/ApprovalItem'
import { DateTime } from 'luxon'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import * as path from 'path'

interface FileUpload {
  link: string;
}

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
      .preload('user')
      .preload('persona', query => query.preload('customer'))
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { links, ...data } = await request.validate(StoreValidator)
    const approvalItem = await new ApprovalItem()
      .merge({ ...data, createdBy: auth.user!.id, companyId: auth.user!.companyId, approvalId: data.approvalId, status: 'waiting_approval' })
      .save()
    const fileUploads: FileUpload[] = []

    for (const link of links) {
      const filePath = link.replace(Env.get('S3_DOMAIN'), '').replace(/^\//, '');

      if (await Drive.exists(filePath)) {
        console.log('entrei:')
        const extension = path.extname(filePath)
        const nameFile = path.basename(filePath)

        const destinationPath = `companies/${auth.user!.companyId}/approvals/${data.approvalId}/items/${approvalItem.id}/${nameFile}`
        console.log('destinationPath:', destinationPath)

        await Drive.move(filePath, destinationPath)
        const updatedUrl = `${Env.get('S3_DOMAIN')}/${destinationPath}`

        const file = await File.query()
          .where('link', link)
          .firstOrFail()

        await file.merge({ companyId: auth.user!.companyId,  createdBy: auth.user!.id, link: updatedUrl, extension: extension, name: nameFile })
          .save()

        await  approvalItem.related('files').create({ fileId: file.id})

        fileUploads.push({
          link: updatedUrl
        })
      }
    }

    await approvalItem.load(loader => {
      loader.preload('approval')
      loader.preload('persona')
      loader.preload('user')
      loader.preload('postsComents', query => query.preload('user'))
    })
    return { approvalItem, fileUploads }
  }


  public async show({ params, auth }: HttpContextContract) {
    const data = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('approval')
      .preload('postsComents', query => query.preload('user'))
      .preload('user')
      .preload('persona')
      .firstOrFail()

    return data

  }

  public async approveAll({ params, auth }: HttpContextContract) {

    const approvalItems = await ApprovalItem.query()
      .where('approvalId', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .andWhere('status', 'waiting_approval')
      .update({ status: 'approved' })
    return approvalItems

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
      loader.preload('persona')
      loader.preload('user')
      loader.preload('postsComents', query => query.preload('user'))
    })

    return approvalItem

  }

  public async restore({ params, auth }: HttpContextContract) {

    const data = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .andWhere('status', 'deleted')
      .firstOrFail()
    await data.merge({ status: 'waiting_approval' }).save()

    return data

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await ApprovalItem.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()
    await data.merge({ status: 'deleted' }).save()
    return
  }
}


