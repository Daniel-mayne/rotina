import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Department } from 'App/Models'
import { StoreValidator } from 'App/Validators/Department'

export default class DepartmentController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Department.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('company')
      .preload('users')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const department = await new Department()
      .merge({
        ...data,
        companyId: auth.user!.companyId,
        status: 'active',
      })
      .save()

    await department.load((loader) => {
      loader.preload('company')
    })

    return department
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
