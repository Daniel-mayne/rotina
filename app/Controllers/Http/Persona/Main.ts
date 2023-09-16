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
    .orderBy(orderColumn, orderDirection)
    .preload('company')
    .preload('customer')
    .paginate(page, limit)
  }


  public async store({ request, auth }: HttpContextContract) {
    const personaData = await request.validate(StoreValidator)
    const persona = await new Persona()
      .merge({ ...personaData, companyId: auth.user!.companyId })
      .save()
    await auth.user?.load(loader => loader.preload('company'))
    const preloads = [persona.load(loader => loader.preload('customer'))]
    await Promise.all(preloads)
    return persona
  }

  public async show({ params }: HttpContextContract) {
    const persona = await Persona.query().where('id', params.id).firstOrFail()
    const preloads = [persona.load(loader => loader.preload('customer'))]
    await Promise.all(preloads)
    return persona
  }

  public async update({ params, request }: HttpContextContract) {

    const personaData = await request.validate(UpdateValidator)
    const persona = await Persona.query().where('id', params.id).firstOrFail()
    await persona.merge(personaData).save()

    const preloads = [persona.load(loader => loader.preload('company'))]
    await Promise.all(preloads)

    return persona

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const persona = await Persona.query()
      .where('id', params.id)
      .andWhere('company_id', auth.user!.companyId)
      .firstOrFail()
    return await persona.delete()
  }
}
