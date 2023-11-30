import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApprovalItem, ApprovalItemFile, File } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/ApprovalItem'
import { DateTime } from 'luxon'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'

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
      .preload('persona')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { links, ...data } = await request.validate(StoreValidator)
    const linksArray = links.split(',')
    const approvalItem = await new ApprovalItem()
      .merge({ ...data, createdBy: auth.user!.id, companyId: auth.user!.companyId, approvalId: data.approvalId, status: 'waiting_approval' })
      .save()

    const uploadedFiles: { name: string, url: string }[] = []

    for (const link of linksArray) {
      const fileUrlParts = link.split('.com/')
      const extractedPath = fileUrlParts.length > 1 ? fileUrlParts[1] : fileUrlParts[0]
      const url = link.split('/')
      const nameExtension = url[url.length - 1]
      const Extension = nameExtension.split('.')
      const fileExtension = Extension.pop()
      const fileName = Extension.join('.')

      const destinationPath = `companies/${auth.user!.companyId}/approvals/${data.approvalId}/items/${approvalItem.id}/${nameExtension}`
      console.log('destinationPath:', destinationPath)

      await Drive.move(extractedPath, destinationPath)
      const updatedUrl = `${Env.get('S3_DOMAIN')}/${destinationPath}`

      const file = await new File()
        .merge({ companyId: auth.user!.companyId, createdBy: auth.user!.id, link: updatedUrl, extension: fileExtension, name: fileName })
        .save()

      await new ApprovalItemFile()
        .merge({ approvalItemId: approvalItem.id, fileId: file.id })
        .save()

      uploadedFiles.push({
        name: fileName,
        url: updatedUrl
      })
    }
    await approvalItem.load(loader => {
      loader.preload('approval')
      loader.preload('persona')
      loader.preload('files')
      loader.preload('user')
    })
    return { approvalItem, uploadedFiles }
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


