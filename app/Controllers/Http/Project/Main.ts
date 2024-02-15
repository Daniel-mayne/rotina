import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Project } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Project'

export default class ProjectController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'title',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Project.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('projectTemplate')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const project = await new Project()
      .merge({
        ...data,
        companyId: auth.user!.companyId,
        createdBy: auth.user!.id,
        status: 'active',
      })
      .save()

    await project.load((loader) => {
      loader.preload('projectTemplate')
    })
    return project
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Project.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('projectTemplate')
      .firstOrFail()

    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const project = await Project.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await project.merge(data).save()
    await project.load((loader) => {
      loader.preload('projectTemplate')
    })
    return project
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Project.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.merge({ status: 'deactivated' }).save()
    return
  }
}
