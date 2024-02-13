import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Project } from 'App/Models'
import { StoreValidator } from 'App/Validators/Project'

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
      .merge({ ...data, companyId: auth.user!.companyId, status: 'active' })
      .save()

      await project.load(loader => {
        loader.preload('projectTemplate')
      })
      return project
  }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
