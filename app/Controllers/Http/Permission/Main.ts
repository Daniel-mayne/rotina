import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Permission } from 'App/Models'
import { StoreValidator } from 'App/Validators/Permission'

export default class PermisionsController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Permission.filter(input).orderBy(orderColumn, orderDirection).paginate(page, limit)
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const permission = await new Permission().merge({ ...data }).save()

    return permission
  }
}
