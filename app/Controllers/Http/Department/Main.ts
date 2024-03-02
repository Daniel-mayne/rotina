import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Department } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Department'

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
      .preload('users')
      .preload('company')
      .preload('permissions')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { userIds, permissionIds, ...data } = await request.validate(StoreValidator)

    const department = await new Department()
      .merge({
        ...data,
        companyId: auth.user!.companyId,
        status: 'active',
      })
      .save()

    if (userIds) await department.related('users').sync(userIds.filter((id) => id))
    if (permissionIds) await department.related('users').sync(permissionIds.filter((id) => id))

    await department.load((loader) => {
      loader.preload('permissions')
      loader.preload('users')
      loader.preload('company')
    })

    return department
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Department.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('users')
      .preload('permissions')
      .firstOrFail()

    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { userIds, permissionIds, ...data } = await request.validate(UpdateValidator)

    const department = await Department.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await department.merge(data).save()

    if (userIds) await department.related('users').sync(userIds.filter((id) => id))
    if (permissionIds) await department.related('users').sync(permissionIds.filter((id) => id))

    await department.load((loader) => {
      loader.preload('users')
      loader.preload('permissions')
    })
    return department
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Department.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.merge({ status: 'deleted' }).save()
    return
  }
}
