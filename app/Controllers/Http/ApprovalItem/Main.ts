import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApprovalItem, Approval } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/ApprovalItem'
import { DateTime } from 'luxon'

export default class ApprovalItemsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await ApprovalItem.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('approval')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const approvalIdExists = await Approval.query()
      .where('id', data.approvalId)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()


    const approvalItem = await new ApprovalItem()
      .merge({ ...data, approvalItemDate: DateTime.now().setZone(), createdBy: auth.user!.id, companyId: auth.user!.companyId, approvalId: approvalIdExists.id, status: 'waiting_approval' })
      .save()
    await approvalItem.load(loader => {
      loader.preload('approval')
    })

    return approvalItem
  }

  public async show({ params, auth }: HttpContextContract) {
    const approvalItem = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('approval')
      .firstOrFail()
   
    return approvalItem

  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const approvalItem = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await approvalItem.merge(data).save()

    await approvalItem.load(loader => {
      loader.preload('approval')
    })

    return approvalItem

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const approvalItem = await ApprovalItem.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    return await approvalItem.delete()
  }
}
