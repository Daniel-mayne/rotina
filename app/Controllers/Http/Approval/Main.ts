import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Approval } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Approval'
import { DateTime } from 'luxon'


export default class ApprovalsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Approval.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const approval = await new Approval()
      .merge({ ...data, companyId: auth.user!.companyId, createdBy: auth.user!.id, status: 'Awaiting approval' })
      .save()

    await approval.load(loader => {
      loader.preload('company')
      loader.preload('customer')
      loader.preload('user')
    })

    return approval
  }

  public async show({ params, auth }: HttpContextContract) {
    const approval = await Approval.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    const preloads = [
      approval.load(loader => loader.preload('customer')),
      approval.load(loader => loader.preload('company')),
    ]
    await Promise.all(preloads)
    return approval
  }

  public async update({ params, request, auth }: HttpContextContract) {

    const approvalData = await request.validate(UpdateValidator)
    const approval = await Approval.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    if (approvalData.status == 'Approved') {
      await approval.merge({ ...approvalData, approvalDate: DateTime.now().setZone() }).save()
    }
    if (approvalData.status == 'Denied') {
      await approval.merge({ ...approvalData, reprovedDate: DateTime.now().setZone() }).save()
    }

    const preloads = [approval.load(loader => loader.preload('customer'))]
    await Promise.all(preloads)

    return approval

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const approval = await Approval.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    approval.merge({ status: 'Deleted' }).save()
    return
  }
}
