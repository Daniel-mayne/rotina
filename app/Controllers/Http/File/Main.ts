import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { File } from 'App/Models'
import { StoreValidator } from 'App/Validators/File'

export default class FilesController {
  public async index({ request }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      status = 'all',
    } = request.qs()
    return await File.query()
      .if(status !== 'all', (query) => query.where('status', status))
      .orderBy(orderColumn, orderDirection)
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const fileData = await request.validate(StoreValidator)
    const file = await new File()
      .merge({ ...fileData, companyId: auth.user!.companyId })
      .save()
    await auth.user?.load('company')
    const preloads = [file.load('customer')]
    await Promise.all(preloads)
    return file
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
