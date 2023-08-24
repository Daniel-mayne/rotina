import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User'
import Stripe from '@ioc:Mezielabs/Stripe'

export default class UserController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      search = null,
    } = request.qs()

    return await User.query()
      .where('company_id', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('company')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    const user = await new User()
      .merge({ ...data, companyId: auth.user!.companyId, status: 'active' })
      .save()

    await auth.user?.load('company', (query) => query.preload('users'))

    // if(auth.user!.company.stripeSubscriptionId){
    //   const userQuantity = auth.user!.company.users.filter((u) => u.status === 'active').length
    //   const sub = await Stripe.subscriptions.retrieve(`${auth.user!.company.stripeSubscriptionId}`)
    //   await Stripe.subscriptionItems.update(sub.items.data[0].id, { quantity: userQuantity })
    // }

    await user.load('company')
    return user
  }

  public async show({ params, auth, response }: HttpContextContract) {
    if (auth.user!.type === 'user' && Number(auth.user!.id) !== Number(params.id)) {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }

    const user = await User.query()
      .where('id', params.id)
      .andWhere('company_id', auth.user!.companyId)
      .firstOrFail()

    return user
  }

  public async update({ params, auth, request, response }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)

    if (auth.user!.type === 'user' && Number(auth.user!.id) !== Number(params.id)) {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }

    const user = await User.query()
      .where('id', params.id)
      .andWhere('company_id', auth.user!.companyId)
      .firstOrFail()

    if (data.email) {
      const duplicatedEmail = await User.query()
        .where('email', data.email)
        .andWhere('id', '!=', user.id)
        .first()

      if (duplicatedEmail) {
        response.status(406).json({
          error: { message: 'Email já cadastrado.' },
        })
      }
    }

    await user.merge(data).save()

    if (data.status) {
      await auth.user?.load('company', (query) => query.preload('users'))
    }

    await user.load('company')
    return user
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const user = await User.query()
      .where('id', params.id)
      .andWhere('company_id', auth.user!.companyId)
      .firstOrFail()
    return await user.delete()
  }
}
