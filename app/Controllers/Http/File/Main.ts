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
      ...input
    } = request.qs()

    return await File.filter(input)
    .orderBy(orderColumn, orderDirection)
    .preload('customer')
    .paginate(page, limit)
}
  public async store({ request, auth }: HttpContextContract) {
    const fileData = await request.validate(StoreValidator)
    const file = await new File()
      .merge({ ...fileData, companyId: auth.user!.companyId })
      .save()
    await auth.user?.load(loader => loader.preload('company'))
    const preloads = [file.load(loader => loader.preload('customer'))]
    await Promise.all(preloads)
    return file
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
