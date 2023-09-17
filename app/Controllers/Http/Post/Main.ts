import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Post, Feed } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post'
import { DateTime } from 'luxon'

export default class PostsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await  Post.filter(input)
    .where('companyId', auth.user!.companyId)
    .orderBy(orderColumn, orderDirection)
    .preload('feeds')
    .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const postData = await request.validate(StoreValidator)

    const feedIdExists = await Feed.query()
      .where('id', postData.feedId)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    
    const post = await new Post()
      .merge({ ...postData, postDate: DateTime.now().setZone(), createdBy: auth.user!.id, companyId: auth.user!.companyId, feedId: feedIdExists.id, status: 'waiting_approval' })
      .save()
    await auth.user?.load(loader => loader.preload('company'))

    const preloads = [post.load(loader => loader.preload('feeds'))]

    await Promise.all(preloads)

    return post
  }

  public async show({ params, auth }: HttpContextContract) {
    const post = await Post.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()
    const preloads = [
      post.load(loader => loader.preload('feeds'))
    ]
    await Promise.all(preloads)
    return post

  }

  public async update({ params, request, auth }: HttpContextContract) {
    const postData = await request.validate(UpdateValidator)
    const post = await Post.query()
    .where('id', params.id)
    .andWhere('companyId', auth.user!.companyId)
    .firstOrFail()
    await post.merge(postData).save()

    const preloads = [post.load(loader => loader.preload('feeds'))]
    await Promise.all(preloads)

    return post

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const post = await Post.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    return await post.delete()
  }
}
