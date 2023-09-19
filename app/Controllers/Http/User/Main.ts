import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import { User } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User'
// import Stripe from '@ioc:Mezielabs/Stripe'
import { DateTime, Duration } from 'luxon'

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
      .orderBy(orderColumn, orderDirection)
      .preload('company')
      .paginate(page, limit)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    let workLoad;
    const userType = auth.user?.type
    if (userType === 'user' && data.type === 'user' || data.type === 'administrator') {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    } else {
      if (data.workStart && data.workEnd && data.lunchStart && data.lunchEnd) {

        const workStart: DateTime = data.workStart
        const workEnd: DateTime = data.workEnd
        const lunchStart: DateTime = data.lunchStart
        const lunchEnd: DateTime = data.lunchEnd
        const BaseInit: DateTime = DateTime.local().startOf('day')
        const firstInterval: Duration = lunchEnd.diff(lunchStart)
        const secondInterval: Duration = workEnd.diff(workStart)
        const CalculateTime: Duration = secondInterval.minus(firstInterval)
        const workInit: DateTime = BaseInit.plus(CalculateTime)
        workLoad = workInit
      } else {
        if (data.workLoad) {
          workLoad = DateTime.fromISO(data.workLoad)
        } else {
          workLoad = DateTime.fromISO('08:00:00', { zone: 'utc' })
        }
      }

      const user = await new User()
        .merge({ ...data, workLoad: workLoad, companyId: auth.user!.companyId, status: 'active', theme: 'white' })
        .save()

      await auth.user?.load('company', (query) => query.preload('users'))

      // if(auth.user!.company.stripeSubscriptionId){
      //   const userQuantity = auth.user!.company.users.filter((u) => u.status === 'active').length
      //   const sub = await Stripe.subscriptions.retrieve(`${auth.user!.company.stripeSubscriptionId}`)
      //   await Stripe.subscriptionItems.update(sub.items.data[0].id, { quantity: userQuantity })
      // }

      await user.load(loader => loader.preload('company'))
      return user
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    const user = await User.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
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
    const {  oldPassword: oldPassword, ...data }= await request.validate(UpdateValidator)

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
          error: { message: "PassWord antigo Invalido" },
        });
        return;
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

    await user.load(loader => loader.preload('company'))
    return user

  }

  public async destroy({ params, auth }: HttpContextContract) {
    const user = await User.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    return await user.delete()
  }
}
