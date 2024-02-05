import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProjectTemplate } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/ProjectTemplates'

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
      .preload('company')
      .preload('user')
      .preload('taskProjectTemplates')
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

  public async show({ params, auth }: HttpContextContract) {
    const data = await ProjectTemplate.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('company')
      .preload('user')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const projectTemplate = await ProjectTemplate.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await projectTemplate.merge(data)
      .save()

    await projectTemplate.load(loader => {
      loader.preload('company')
        .preload('user')
    })
    return projectTemplate
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await ProjectTemplate.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.delete()
    return
  }
}
