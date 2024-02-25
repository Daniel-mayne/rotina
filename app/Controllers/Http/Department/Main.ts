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
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { userIds: userIds, ...data } = await request.validate(StoreValidator)

    const department = await new Department()
      .merge({
        ...data,
        companyId: auth.user!.companyId,
        status: 'active',
      })
      .save()

    console.log(userIds)
    if (userIds) {
      const validUserIds = userIds.filter((id): id is number => id !== undefined)
      console.log(userIds)
      console.log(validUserIds)
      await department.related('users').sync(validUserIds)
    }

    await department.load((loader) => {
      loader.preload('users')
      loader.preload('company')
    })

    return department
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Department.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('company')
      .preload('users')
      .firstOrFail()

    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { userIds: userIds, ...data } = await request.validate(UpdateValidator)
    console.log(userIds)

    const department = await Department.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await department.merge(data).save()

    if (userIds) {
      const validUserIds = userIds.filter((id): id is number => id !== undefined)
      await department.related('users').sync(validUserIds)
    }
    await department.load((loader) => {
      loader.preload('users')
      loader.preload('company')
    })
    return department
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Department.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.delete()
    return
  }
}
