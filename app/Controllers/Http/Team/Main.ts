import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Team } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Team'

export default class TeamsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Team.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('users')
      .preload('company')
      .paginate(page, limit)
  }
  public async store({ request, auth }: HttpContextContract) {
    const { userIds: userIds, ...data } = await request.validate(StoreValidator)

    const team = await new Team()
      .merge({
        ...data,
        companyId: auth.user!.companyId,
        status: 'active',
      })
      .save()

    if (userIds) {
      const validUserIds = userIds.filter((id): id is number => id !== undefined)
      await team.related('users').sync(validUserIds)
    }

    await team.load((loader) => {
      loader.preload('users')
      loader.preload('company')
    })

    return team
  }

  public async show({ params, auth }: HttpContextContract) {
    const team = await Team.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('users')
      .preload('company')
      .firstOrFail()

    return team
  }

  public async update({ params, auth, request }: HttpContextContract) {
    const { userIds: userIds, ...data } = await request.validate(UpdateValidator)

    const team = await Team.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await team.merge(data).save()

    if (userIds) {
      const validUserIds = userIds.filter((id): id is number => id !== undefined)
      await team.related('users').sync(validUserIds)
    }

    await team.load((loader) => {
      loader.preload('users')
      loader.preload('company')
    })
    return team
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Team.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.merge({ status: 'deleted' }).save()
    return
  }
}
