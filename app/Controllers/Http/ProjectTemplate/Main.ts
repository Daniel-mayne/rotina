import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProjectTemplate } from 'App/Models'
import { StoreValidator } from 'App/Validators/ProjectTemplates'

export default class ProjectTemplateController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'title',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await ProjectTemplate.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const projectTemplate = await new ProjectTemplate()
      .merge({ ...data, companyId: auth.user!.companyId, createdBy: auth.user!.id })
      .save()

      await projectTemplate.load(loader => {
        loader.preload('company')
        .preload('user')
      })

      return projectTemplate
   }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
