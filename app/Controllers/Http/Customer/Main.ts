import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Customer } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Customer'

export default class CustomersController {
  public async index({ request }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      status = 'all',
    } = request.qs()

    return await Customer.query()
      .if(status !== 'all', (query) => query.where('status', status))
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

  public async show({ params, auth, response }: HttpContextContract) {
    if (auth.user?.type !== 'administrator' && auth.user?.type !== "user" && auth.user?.type !== "owner") {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }

    const customer = await Customer.query().where('id', params.id).preload('company').preload('personas').firstOrFail()
    return customer
  }

  public async update({ params, request }: HttpContextContract) {
    const customerData = await request.validate(UpdateValidator)
    const customer = await Customer.query().where('id', params.id).firstOrFail()
    await customer.merge(customerData).save()
    await customer.load(loader => loader.preload('company'))

    return customer

  }

  public async destroy({ params }: HttpContextContract) {
    const customer = await Customer.query().where('id', params.id).firstOrFail()
    await customer.merge({ status: 'deactivated' }).save()
    return true
  }
}
