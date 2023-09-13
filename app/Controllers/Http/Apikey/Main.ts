import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Apikey } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Apikey'
import  Encryption  from '@ioc:Adonis/Core/Encryption'

export default class AnnotationController {
  public async index({}: HttpContextContract) {}

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const { id } = auth.user!
    const key = Encryption.encrypt({ id })
    const apikey = await new Apikey().merge({ ...data, companyId: auth.user!.companyId, userId: auth.user!.id, value: key }).save()
    await apikey.load(loader => loader.preload('user'))
    return apikey
  }

  public async show({}: HttpContextContract) {}

  public async update({ params, auth, request }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)

    const { id } = auth.user!

    const apikey = await Apikey.query()
      .where('id', params.id)
      .andWhere('user_id', auth.user!.id)
      .firstOrFail()

    const key = Encryption.encrypt({ id })

    await apikey.merge({ ...data, value: key }).save()
    await apikey.load(loader => loader.preload('user'))

    return apikey
  }

  public async destroy({ params, auth }: HttpContextContract) {

    const apikey = await Apikey.query()
      .where('id', params.id)
      .andWhere('user_id', auth.user!.id)
      .firstOrFail()

    apikey.delete()
    return
  }
}
