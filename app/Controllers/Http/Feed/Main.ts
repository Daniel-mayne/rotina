import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Feed } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Feed'

export default class FeedsController {
  public async index({ request }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      status = 'all',
    } = request.qs()
    return await Feed.query()
      .if(status !== 'all', (query) => query.where('status', status))
      .orderBy(orderColumn, orderDirection)
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const feedData = await request.validate(StoreValidator)
    const feed = await new Feed()
      .merge({ ...feedData, companyId: auth.user!.companyId, createdBy: auth.user!.id, status: 'active' })
      .save()
    await auth.user?.load('company')

    const preloads = [feed.load('customer')]

    await Promise.all(preloads)

    return feed
  }

  public async show({ params }: HttpContextContract) {

    const feed = await Feed.query().where('id', params.id).firstOrFail()

    const preloads = [
      feed.load('customer'),
      feed.load('company'),
    ]


    await Promise.all(preloads)
    return feed

  }

  public async update({ params, request }: HttpContextContract) {

    const feedData = await request.validate(UpdateValidator)
    const feed = await Feed.query().where('id', params.id).firstOrFail()
    await feed.merge(feedData).save()

    const preloads = [feed.load('customer')]
    await Promise.all(preloads)

    return feed

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const feed = await Feed.query()
      .where('id', params.id)
      .andWhere('company_id', auth.user!.companyId)
      .firstOrFail()
    return await feed.delete()
  }
}
