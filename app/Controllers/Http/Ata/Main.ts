import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Ata, Customer } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Ata'
import { DateTime } from 'luxon'

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
      .preload('customer')
      .preload('creator')
      .preload('users')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { title, userIds, ...data } = await request.validate(StoreValidator)

    let randomTitle = ''

    if (!title) {
      const customer = await Customer.query()
        .where('id', data.customerId)
        .andWhere('companyId', auth.user!.companyId)
        .firstOrFail()

      randomTitle = 'ata_' + DateTime.now().toFormat('dd_LLL_yyyy') + '_' + customer.name
    }

    const ata = await new Ata()
      .merge({
        ...data,
        createdBy: auth.user!.id,
        companyId: auth.user!.companyId,
        title: title ? title : randomTitle,
      })
      .save()

    if (userIds) await ata.related('users').sync(userIds.filter((id) => id))

    await ata.load((loader) => {
      loader.preload('customer')
      loader.preload('creator')
      loader.preload('users')
    })

    return ata
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Ata.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('customer')
      .preload('creator')
      .preload('users')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { userIds, ...data } = await request.validate(UpdateValidator)
    const ata = await Ata.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await ata.merge(data).save()
    if (userIds) await ata.related('users').sync(userIds.filter((id) => id))
    await ata.load((loader) => {
      loader.preload('customer')
      loader.preload('creator')
      loader.preload('users')
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
