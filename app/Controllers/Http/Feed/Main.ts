import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Feed, Customer } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Feed'

export default class FeedsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Feed.filter(input)
    .where('companyId', auth.user!.companyId)
    .orderBy(orderColumn, orderDirection)
    .preload('customer')
    .paginate(page, limit)
}

  public async store({ request, auth }: HttpContextContract) {
    const feedData = await request.validate(StoreValidator)

    const customerIdExists = await Customer.query()
    .where('id', feedData.customerId)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()


    const feed = await new Feed()
      .merge({ ...feedData, companyId: auth.user!.companyId, createdBy: auth.user!.id, customerId: customerIdExists.id, status: 'active' })
      .save()
    await auth.user?.load(loader => loader.preload('company'))
    const preloads = [feed.load(loader => loader.preload('company'))]
    await Promise.all(preloads)

    return feed
  }

  public async show({ params, auth }: HttpContextContract) {
    const feed = await Feed.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()
    const preloads = [
      feed.load(loader => loader.preload('customer')),
      feed.load(loader => loader.preload('company')),
    ]
    await Promise.all(preloads)
    return feed
  }

  public async update({ params, request, auth }: HttpContextContract) {

    const feedData = await request.validate(UpdateValidator)
    const feed = await Feed.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()
    await feed.merge(feedData).save()
    const preloads = [feed.load(loader => loader.preload('customer'))]
    await Promise.all(preloads)

    return feed

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const feed = await Feed.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
      feed.merge({ status: 'deactivated'}).save()
    return 
  }
}
