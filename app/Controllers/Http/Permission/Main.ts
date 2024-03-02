import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Permission } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Permission'

export default class PermisionsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Permission.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('departments')
      .preload('company')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { departmentIds, ...data } = await request.validate(StoreValidator)

    const permission = await new Permission()
      .merge({ ...data, companyId: auth.user!.companyId })
      .save()

    if (departmentIds)
      await permission.related('departments').sync(departmentIds.filter((id) => id))

    await permission.load((loader) => {
      loader.preload('departments')
      loader.preload('company')
    })

    return permission
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Permission.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('departments')
      .preload('company')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { departmentIds, ...data } = await request.validate(UpdateValidator)
    const permission = await Permission.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await permission.merge(data).save()

    if (departmentIds)
      await permission.related('departments').sync(departmentIds.filter((id) => id))

    await permission.load((loader) => {
      loader.preload('departments')
      loader.preload('company')
    })

    return permission
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Permission.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.delete()
    return
  }
}
