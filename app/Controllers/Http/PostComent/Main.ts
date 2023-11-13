import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PostComent } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/PostComent'
import { DateTime } from 'luxon'


export default class MainsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10, page = 1,
      orderColumn = 'text',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await PostComent.filter(input)
      .where('companyId', auth.user!.companyId)
      .if(orderColumn && orderDirection, query => query.orderBy(orderColumn, orderDirection))
      .preload('approvalItem')
      .preload('user')
      .paginate(page, limit)

  }

  public async store({ request  }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const postComent = await new PostComent()
      .merge({ ...data, approvalItemId: data.approvalItemId })
      .save()
    await postComent.load(loader => {
      loader.preload('approvalItem')
    })

    return postComent
   }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
