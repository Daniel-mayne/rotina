import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Persona } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Persona'

export default class PersonaController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Persona.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('company')
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const persona = await new Persona()
      .merge({
        ...data,
        companyId: auth.user!.companyId,
        customerId: data.customerId,
        status: 'active',
      })
      .save()

    await persona.load((loader) => {
      loader.preload('customer')
    })

    return persona
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Persona.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('customer')
      .firstOrFail()

    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)

    const persona = await Persona.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    await persona.merge(data).save()

    await persona.load((loader) => {
      loader.preload('customer')
    })

    return persona
  }

  public async restore({ params, auth }: HttpContextContract) {
    const data = await Persona.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .andWhere('status', 'deleted')
      .firstOrFail()
    await data.merge({ status: 'active' }).save()

    return data
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Persona.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.merge({ status: 'deleted' }).save()
    return
  }
}
