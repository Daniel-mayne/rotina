import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TaskTemplate } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/TaskTemplates'

export default class TaskTemplateController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'title',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await TaskTemplate.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('user')
      .preload('taskProjectTemplates')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const taskTemplate = await new TaskTemplate()
      .merge({
        ...data,
        createdBy: auth.user!.id,
        companyId: auth.user!.companyId,
      })
      .save()
    await taskTemplate.load((loader) => {
      loader.preload('taskProjectTemplates')
    })
    return taskTemplate
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await TaskTemplate.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('taskProjectTemplates')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const taskTemplate = await TaskTemplate.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await taskTemplate.merge(data).save()
    await taskTemplate.load((loader) => {
      loader.preload('taskProjectTemplates').preload('user')
    })
    return taskTemplate
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await TaskTemplate.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.delete()
    return
  }
}
