import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Customer } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Customer'

export default class CustomersController {
  public async index({ request,auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Customer.filter(input)
    .where('companyId', auth.user!.companyId)
    .orderBy(orderColumn, orderDirection)
      .preload('company')
      .paginate(page, limit)
  }


  public async store({ request, auth }: HttpContextContract) {
    const customerData = await request.validate(StoreValidator)
    const customer = await new Customer()
      .merge({ ...customerData, companyId: auth.user!.companyId, createdBy: auth.user!.id, accountManagerId: auth.user!.id, fillingPercentage: 0.0, status: 'active' })
      .save()

    await customer.load(loader => loader.preload('company'))
    return customer
  }

  public async show({ params, auth }: HttpContextContract) {
    const customer = await Customer.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .preload('company')
    .preload('personas')
    .firstOrFail()
    return customer
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const customerData = await request.validate(UpdateValidator)
    const customer = await Customer.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()
    await customer.merge(customerData).save()
    await customer.load(loader => loader.preload('company'))

    return customer

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const customer = await Customer.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()
    await customer.merge({ status: 'deactivated' }).save()
    return true
  }
}
