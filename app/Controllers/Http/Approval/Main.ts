import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Approval, Customer } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Approval'

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
    const approvalData = await request.validate(StoreValidator)

    const customerIdExists = await Customer.query()
    .where('id', approvalData.customerId)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()


    const approval = await new Approval()
      .merge({ ...approvalData, companyId: auth.user!.companyId, createdBy: auth.user!.id, customerId: customerIdExists.id, status: 'active' })
      .save()
    await auth.user?.load(loader => loader.preload('company'))
    const preloads = [approval.load(loader => loader.preload('company'))]
    await Promise.all(preloads)

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
    await approval.merge(approvalData).save()
    const preloads = [approval.load(loader => loader.preload('customer'))]
    await Promise.all(preloads)

    return approval

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const approval = await Approval.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
      approval.merge({ status: 'deactivated'}).save()
    return 
  }
}
