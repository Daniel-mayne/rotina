import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Company } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Company'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Stripe from '@ioc:Mezielabs/Stripe'
import Env from '@ioc:Adonis/Core/Env'

export default class CompanyController {
  public async index({ request }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      status = 'all',
    } = request.qs()
    return await Company.query()
      .if(status !== 'all', (query) => query.where('status', status))
      .orderBy(orderColumn, orderDirection)
      .preload('users')
      // .preload('lostReasons')
      // .preload('customfields')
      // .preload('products')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const { adminEmail, adminName, adminPassword, adminPhone, ...companyData } =
      await request.validate(StoreValidator)

    // const custommerStripe = await Stripe.customers.create({  
    //   email: adminEmail,
    //   name: companyData.name,
    //   phone: adminPhone ? adminPhone : undefined,
    // })

    // const session = await Stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['boleto', 'card'],
    //   customer: custommerStripe.id,
    //   line_items: [{ price: 'price_1LdBsTAeqyH30K8cSj905YoB', quantity: 1, adjustable_quantity: { enabled: true, minimum: 1 } }],
    //   subscription_data: {
    //     trial_period_days: 7,
    //   },
    //   success_url: `https://app.cubosuite.com.br/paymentSuccess`,
    //   cancel_url: 'https://app.cubosuite.com.br/paymentFailed',
    // })

    const company = await new Company()
      .merge({
        ...companyData,
        userLimit: 9999,
        // status: 'waiting_activation',
        // stripeCustomerId: custommerStripe.id,
      })
      .save()

    const user = await company.related('users').create({
      name: adminName,
      password: adminPassword,
      phone: adminPhone,
      email: adminEmail,
      type: 'administrator',
      companyId: company.id,
    })

    // await company
    //   .related('lostReasons')
    //   .createMany([
    //     { reason: 'Interesse - Perdeu o interesse' },
    //     { reason: 'Engano - Cadastrou por engano' },
    //     { reason: 'Capital - Sem parte do capital' },
    //     { reason: 'Capital - Sem 100% do capital' },
    //     { reason: 'Concorrente - Preço' },
    //     { reason: 'Concorrente - Qualidade' },
    //     { reason: 'Concorrente - Condição' },
    //   ])

    // await company.related('products').create({
    //   name: 'Produto Inicial',
    //   sku: '######',
    //   price: 500,
    // })

    // await company.related('customfields').createMany([
    //   { name: 'Email', context: 'deal', type: 'text' },
    //   { name: 'UTM Source', context: 'deal', type: 'text' },
    //   { name: 'UTM Medium', context: 'deal', type: 'text' },
    //   { name: 'UTM Campaign', context: 'deal', type: 'text' },
    //   { name: 'UTM Content', context: 'deal', type: 'text' },
    //   { name: 'UTM Term', context: 'deal', type: 'text' },
    // ])

    // const pipe = await user.related('pipes').create({
    //   name: 'Funil de vendas',
    //   companyId: company.id,
    //   orderNr: 1,
    //   dailyReports: `${user.email}`,
    // })

    // await pipe.related('stages').createMany([
    //   { name: 'Novos', orderNr: 1, rottenFlag: true, rottenDays: 3 },
    //   { name: 'Tentativa de contato', orderNr: 2, rottenFlag: false },
    //   { name: 'Em negociação', orderNr: 3, rottenFlag: false },
    // ])

    const preloads = [
      company.load('users'),
      // company.load('lostReasons'),
      // company.load('customfields'),
      // company.load('products'),
    ]

    await Promise.all(preloads)

    // const token = await auth.attempt(adminEmail, adminPassword, { expiresIn: '1 day' })

    // const sgMail = require('@sendgrid/mail')

    // sgMail.setApiKey(Env.get('SENDGRID_API', ''))

    // await sgMail.send({
    //   to: adminEmail,
    //   from: 'no-reply@cubocrm.com.br',
    //   templateId: 'd-ca8a6879a1df4c8ebaebfc22a3bf1f27',
    //   dynamicTemplateData: {
    //     // url: `http://localhost/confirmAccount?token=${token.token}`,
    //     url: `https://app.cubosuite.com.br/confirmAccount?token=${token.token}`,
    //   },
    // })

    return  company 
  }

  // public async activeAccount({ request, auth, response }: HttpContextContract) {
  //   const company = await Company.query().where('id', auth.user!.companyId).firstOrFail()

  //   if (company.status !== 'waiting_activation') {
  //     response.badRequest({
  //       errors: [{ message: 'Conta já confirmada.' }],
  //     })
  //   }

  //   await company.merge({ status: 'active' }).save()

  //   return true
  // }

  // public async sendInvoice({ auth }: HttpContextContract) {
  //   const company = await Company.query().where('id', auth.user!.companyId).firstOrFail()

  //   const sub = await Stripe.subscriptions.retrieve(`${company.stripeSubscriptionId}`)

  //   if (sub.latest_invoice) {
  //     await Stripe.invoices.sendInvoice(`${sub.latest_invoice}`)
  //   }

  //   return true
  // }

  // public async createCheckout({ auth }: HttpContextContract) {
  //   const company = await Company.query().where('id', auth.user!.companyId).firstOrFail()

  //   const session = await Stripe.checkout.sessions.create({
  //     mode: 'subscription',
  //     payment_method_types: ['boleto', 'card'],
  //     customer: company.stripeCustomerId,
  //     line_items: [{ price: 'price_1LdBsTAeqyH30K8cSj905YoB', quantity: 1, adjustable_quantity: { enabled: true, minimum: 1 } }],
  //     subscription_data: {
  //       trial_period_days: 7,
  //     },
  //     success_url: `https://app.cubosuite.com.br/reports/company?startPage=true`,
  //     cancel_url: 'https://app.cubosuite.com.br/reports/company?startPage=true',
  //   })

  //   return session
  // }

  // public async createBilling({ auth, response }: HttpContextContract) {
  //   const company = await Company.query().where('id', auth.user!.companyId).firstOrFail()

  //   if (company.stripeCustomerId) {
  //     const session = await Stripe.billingPortal.sessions.create({
  //       customer: company.stripeCustomerId,
  //     })
  //     return session.url
  //   }

  //   return response.badRequest({
  //     errors: [{ message: 'Sua conta não possui assinatura vinculada, fale com o administrador.' }],
  //   })
  // }

  public async show({ params, auth, response }: HttpContextContract) {
    if (Number(auth.user?.companyId) !== Number(params.id) && auth.user?.type !== 'owner') {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }

    const company = await Company.query().where('id', params.id).firstOrFail()

    const preloads = [
      company.load('users'),
      // company.load('lostReasons'),
      // company.load('customfields'),
      // company.load('products'),
    ]

    await Promise.all(preloads)
    return company
  }

  public async update({ params, auth, request, response }: HttpContextContract) {
    if (auth.user?.companyId !== params.id && auth.user?.type !== 'owner') {
      response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }

    const data = await request.validate(UpdateValidator)
    const company = await Company.query().where('id', params.id).firstOrFail()

    await company.merge(data).save()

    const preloads = [
      company.load('users'),
      // company.load('lostReasons'),
      // company.load('customfields'),
      // company.load('products'),
    ]

    await Promise.all(preloads)

    return company
  }

  public async destroy({ params }: HttpContextContract) {
    const company = await Company.query().where('id', params.id).firstOrFail()
    company.merge({ status: 'deactivated' }).save()
    return
  }
}
