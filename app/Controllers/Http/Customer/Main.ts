import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Customer } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Customer'

export default class CustomersController {
  public async index({ request, auth }: HttpContextContract) {
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
      .preload('accountManager')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const customer = await new Customer()
      .merge({ ...data, companyId: auth.user!.companyId, createdBy: auth.user!.id, accountManagerId: auth.user!.id, fillingPercentage: 0.0, status: 'active' })
      .save()

    await customer.load(loader => {
      loader.preload('company')
        .preload('accountManager')
    })
    return customer
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Customer.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('company')
      .preload('accountManager')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const customer = await Customer.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await customer.merge(data).save()
    await customer.load(loader => {
      loader.preload('company')
        .preload('accountManager')
    })

    return customer

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Customer.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.merge({ status: 'deactivated' }).save()
    return
  }
}
