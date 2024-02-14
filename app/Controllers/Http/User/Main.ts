import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import { User } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User'
// import Stripe from '@ioc:Mezielabs/Stripe'

export default class UserController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await User.filter(input)
      .where('companyId', auth.user!.companyId)
      .if(orderColumn && orderDirection, (query) => query.orderBy(orderColumn, orderDirection))
      .preload('company')
      .preload('customer')
      .paginate(page, limit)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const data = await request.validate(StoreValidator)

    if (auth.user?.type === 'user' && data.type === 'administrator') {
      return response.unauthorized({
        error: { message: 'Você só pode criar usuários do tipo comum.' },
      })
    }

    const user = await new User()
      .merge({ ...data, companyId: auth.user!.companyId, status: 'active', theme: 'white' })
      .save()

    // if(auth.user!.company.stripeSubscriptionId){
    //   const userQuantity = auth.user!.company.users.filter((u) => u.status === 'active').length
    //   const sub = await Stripe.subscriptions.retrieve(`${auth.user!.company.stripeSubscriptionId}`)
    //   await Stripe.subscriptionItems.update(sub.items.data[0].id, { quantity: userQuantity })
    // }

    await user.load((loader) => {
      loader.preload('company')
    })
    return user
  }

  public async show({ params, auth, response }: HttpContextContract) {
    const user = await User.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('company')
      .firstOrFail()

    const userTypeShow = auth.user?.type
    if (userTypeShow == 'user' && user.type == 'administrator') {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }

    return user
  }

  public async update({ params, auth, request, response }: HttpContextContract) {
    const { oldPassword: oldPassword, ...data } = await request.validate(UpdateValidator)

    const user = await User.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    const userTypeUpdate = auth.user?.type
    if (userTypeUpdate == 'user' && (user.type == 'user' || user.type == 'administrator')) {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }

    if (oldPassword) {
      if (!(await Hash.verify(user.password, oldPassword))) {
        response.unauthorized({
          error: { message: 'Password antigo invalido' },
        })
        return
      }
    }

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

    await user.load((loader) => {
      loader.preload('company')
    })
    return user
  }

  public async restore({ params, auth }: HttpContextContract) {
    const data = await User.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .andWhere('status', 'deleted')
      .firstOrFail()
    await data.merge({ status: 'active' }).save()

    return data
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const user = await User.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()

    if (user.id === auth.user!.id) {
      return response.unauthorized('Você não pode se excluir.')
    }

    if (user.type === 'administrator') {
      const adminsCount = await User.query()
        .where('companyId', auth.user!.companyId)
        .andWhere('type', 'administrator')
        .count('* as total')

      const adminCount = adminsCount[0].$extras.total

      if (adminCount <= 1) {
        return response.unauthorized('Não é possível excluir o último administrador da empresa.')
      }
    }

    await user.merge({ status: 'deleted' }).save()
    return
  }
}
