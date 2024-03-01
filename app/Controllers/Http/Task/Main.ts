import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Task } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Task'

export default class TaskController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'title',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Task.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('user')
      .preload('project')
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const task = await new Task()
      .merge({
        ...data,
        initialUserId: auth.user!.id,
        companyId: auth.user!.companyId,
      })
      .save()
    await task.load((loader) => {
      loader.preload('user')
      loader.preload('customer')
      loader.preload('project')
    })
    return task
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Task.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('user')
      .preload('customer')
      .preload('project')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const task = await Task.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await task.merge(data).save()
    await task.load((loader) => {
      loader.preload('user').preload('customer').preload('project')
    })
    return task
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Task.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.merge({ status: 'deleted' }).save()
    return
  }
}
