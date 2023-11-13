import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApprovalItem } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/ApprovalItem'
import { DateTime } from 'luxon'

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
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const approvalItem = await new ApprovalItem()
      .merge({ ...data, createdBy: auth.user!.id, companyId: auth.user!.companyId, approvalId: data.approvalId, status: 'waiting_approval' })
      .save()
    await approvalItem.load(loader => {
      loader.preload('approval')
    })

    return approvalItem
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
    await approvalItem.merge({ ...data,  
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


