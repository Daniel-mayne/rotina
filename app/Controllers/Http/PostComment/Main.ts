import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PostComment } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/PostComment'
import { DateTime } from 'luxon'


export default class PostCommentController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10, page = 1,
      orderColumn = 'text',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await PostComment.filter(input)
      .where('companyId', auth.user!.companyId)
      .if(orderColumn && orderDirection, query => query.orderBy(orderColumn, orderDirection))
      .preload('approvalItem')
      .paginate(page, limit)

  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const postComment = await new PostComment()
      .merge({ ...data, approvalItemId: data.approvalItemId, companyId: auth.user!.companyId, })
      .save()
    await postComment.load(loader => {
      loader.preload('approvalItem')
    })

    return postComment
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await PostComment.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('approvalItem')
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
