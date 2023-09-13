import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Post } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post'
import { DateTime } from 'luxon'

export default class PostsController {
  public async index({ request }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      status = 'all',
    } = request.qs()
    return await Post.query()
      .if(status !== 'all', (query) => query.where('status', status))
      .orderBy(orderColumn, orderDirection)
      .preload('feeds')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const postData = await request.validate(StoreValidator)
    const post = await new Post()
      .merge({ ...postData, postDate: DateTime.now().setZone(), createdBy: auth.user!.id, status: 'waiting_approval' })
      .save()
    await auth.user?.load('company')

    const preloads = [post.load('feeds')]

    await Promise.all(preloads)

    return post
  }

  public async show({ params }: HttpContextContract) {
    const post = await Post.query().where('id', params.id).firstOrFail()
    const preloads = [
      post.load('feeds')
    ]
    await Promise.all(preloads)
    return post

  }

  public async update({ params, request }: HttpContextContract) {
    const postData = await request.validate(UpdateValidator)
    const post = await Post.query().where('id', params.id).firstOrFail()
    await post.merge(postData).save()

    const preloads = [post.load('feeds')]
    await Promise.all(preloads)

    return post

  }

  public async destroy({ params }: HttpContextContract) {
    const post = await Post.query()
      .where('id', params.id)
      .firstOrFail()
    return await post.delete()
  }
}
