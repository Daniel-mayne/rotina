import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Ata } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Ata'

export default class AtaController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'title',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Ata.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('user')
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const ata = await new Ata()
      .merge({
        ...data,
        createdBy: auth.user!.id,
        companyId: auth.user!.companyId,
      })
      .save()
    await ata.load((loader) => {
      loader.preload('user')
      loader.preload('customer')
    })

    return ata
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Ata.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('user')
      .preload('customer')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const ata = await Ata.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await ata.merge(data).save()
    await ata.load((loader) => {
      loader.preload('user')
      loader.preload('customer')
    })
    return ata
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Ata.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    return await data.delete()
  }
}
