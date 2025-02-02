import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PostComment } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/PostComment'

export default class PostCommentController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'text',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await PostComment.filter(input)
      .where('companyId', auth.user!.companyId)
      .if(orderColumn && orderDirection, (query) => query.orderBy(orderColumn, orderDirection))
      .preload('approvalItem')
      .preload('user')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const comment = await new PostComment()
      .merge({
        ...data,
        approvalItemId: data.approvalItemId,
        companyId: auth.user!.companyId,
        userId: auth.user!.id,
      })
      .save()
    await comment.load((loader) => {
      loader.preload('approvalItem')
      loader.preload('user')
    })

    return comment
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await PostComment.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('approvalItem')
      .preload('user')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const comment = await PostComment.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await comment.merge(data)

    return comment
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await PostComment.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    return await data.delete()
  }
}
