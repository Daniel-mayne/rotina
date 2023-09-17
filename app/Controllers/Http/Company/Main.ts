import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Company } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Company'
// import Stripe from '@ioc:Mezielabs/Stripe'
import Env from '@ioc:Adonis/Core/Env'

export default class CompanyController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Company.filter(input)
    .where('id', auth.user!.companyId) 
    .orderBy(orderColumn, orderDirection)
      .preload('users')
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
        status: 'waiting_activation',
        // stripeCustomerId: custommerStripe.id,
      })
      .save()

    await company.related('users').create({
      name: adminName,
      password: adminPassword,
      phone: adminPhone,
      email: adminEmail,
      type: 'administrator',
      companyId: company.id,
    })

    await company.load(loader => loader.preload('users'))

    const token = await auth.attempt(adminEmail, adminPassword, { expiresIn: '1 day' })

    const sgMail = require('@sendgrid/mail')

    sgMail.setApiKey(Env.get('SENDGRID_API', ''))

    await sgMail.send({
      to: adminEmail,
      from: 'no-reply@cubocrm.com.br',
      templateId: 'd-ca8a6879a1df4c8ebaebfc22a3bf1f27',
      dynamicTemplateData: {
        url: `http://127.0.0.1:3333/confirmAccount?token=${token.token}`,
      },
    })

    return company
  }

  public async activeAccount({ auth, response }: HttpContextContract) {
    const company = await Company.query().where('id', auth.user!.companyId).firstOrFail()

    if (company.status !== 'waiting_activation') {
      response.badRequest({
        errors: [{ message: 'Conta já confirmada.' }],
      })
    }

    await company.merge({ status: 'active' }).save()

    return true
  }

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

  public async show({ params, auth }: HttpContextContract) {
    const company = await Company.query()
    .where('id', params.id)
    .andWhere('id', auth.user!.companyId)
    .preload('users').firstOrFail()
    return company
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const company = await Company
    .query()
    .where('id', params.id)
    .andWhere('id', auth.user!.companyId)
    .firstOrFail()
    await company.merge(data).save()
    await company.load(loader => loader.preload('users'))
    return company
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const company = await Company.query()
    .where('id', params.id)
    .andWhere('id', auth.user!.companyId)
    .firstOrFail()
    company.merge({ status: 'deactivated' }).save()
    return
  }
}
