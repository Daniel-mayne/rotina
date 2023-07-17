import { JobContract } from '@ioc:Rocketseat/Bull'
import { Deal, Pipe, Integration, People, Organization } from 'App/Models'
import Bull from '@ioc:Rocketseat/Bull'
import ValidatePhone from 'App/Jobs/ValidatePhone'
import RdIntegration from 'App/Jobs/SendRdStationIntegration'
import WebhookIntegration from 'App/Jobs/WebhookIntegration'
import SendWhatsappNotification from 'App/Jobs/SendWhatsappNotification'

export default class ExternalDeal implements JobContract {
  public key = 'ExternalDeal'

  public async handle(job) {
    const { data } = job

    const pipe = await Pipe.query()
      .where('id', data.payload.pipeId)
      .if(data.user!.type === 'user', (query) =>
        query.andWhereHas('users', (query) => query.where('user_id', data.user.id))
      )
      .andWhere('company_id', data.user.companyId)
      .preload('users')
      .preload('primary')
      .firstOrFail()

    if (data.customfields) {
      if (pipe?.primary) {
        const primaryCf = data.customfields.filter((cf) => cf.customfieldId === pipe.primary.id)[0]
        if (primaryCf) {
          const duplicatedDeal = await Deal.query()
            .where('pipe_id', pipe.id)
            .andWhereHas('customfields', (query) =>
              query
                .where('customfield_id', primaryCf.customfieldId)
                .andWhere('value', primaryCf.value)
            )
            .first()

          if (duplicatedDeal) {
            data.duplicatedId = duplicatedDeal.id
            data.userId = duplicatedDeal.userId
          }
        }
      }
    }

    let userSplit

    if (!data.payload.userId) {
      for (const user of pipe.users) {
        let count = user.$extras.pivot_count
        const max = user.$extras.pivot_splitter

        if (max !== 0 && count < max) {
          userSplit = user.id
          await pipe.related('users').sync(
            {
              [user.id]: {
                count: count + 1,
              },
            },
            false
          )

          user.$extras.pivot_count++

          break
        }
      }

      const completed = pipe.users.filter((u) => u.$extras.pivot_count === u.$extras.pivot_splitter)

      if (completed.length === pipe.users.length) {
        const payload = pipe.users.reduce((acc, item) => {
          return { ...acc, [Number(item.id)]: { count: 0 } }
        }, {})

        await pipe.related('users').sync(payload, false)
      }
    }

    let organizationId

    if (data.organizationName) {
      const organization = await Organization.create({
        name: data.organizationName,
        companyId: data.user.companyId,
        userId: data.user.id,
      })
      organizationId = organization.id
    }

    const people = await People.create({
      name: data.peopleName,
      phone: data.peoplePhone ? data.peoplePhone : null,
      organizationId: organizationId ? organizationId : null,
      userId: userSplit ? userSplit : data.userId ? data.userId : data.user.id,
      companyId: data.user.companyId,
    })

    const price = data.products
      ? data.products.reduce((acc, current) => (acc += current.price * current.quantity), 0)
      : data.price
      ? data.price
      : 0
    const deal = new Deal()
    await deal
      .merge({
        ...data.payload,
        peopleId: people.id,
        organizationId: organizationId ? organizationId : null,
        userId: userSplit ? userSplit : data.userId ? data.userId : data.user.id,
        price,
      })
      .save()

    if (data.peoplePhone) {
      const people = await People.query().where('id', deal.peopleId).firstOrFail()
      await people.merge({ phone: data.peoplePhone, validPhone: 'validating' }).save()
      await Bull.add(new ValidatePhone().key, { people })
    }

    if (data.customfields) {
      await deal.related('customfields').createMany(data.customfields)

      if (pipe?.primary) {
        const primaryCf = data.customfields.filter((cf) => cf.customfieldId === pipe.primary.id)[0]

        if (primaryCf) {
          const duplicatedDeal = await Deal.query()
            .where('pipe_id', !data.pipeId)
            .andWhereHas('customfields', (query) =>
              query
                .where('customfield_id', primaryCf.customfieldId)
                .andWhere('value', primaryCf.value)
            )
            .first()

          if (duplicatedDeal) {
            await deal.merge({ duplicatedId: duplicatedDeal.id }).save()
          }
        }
      }
    }

    if (data.products) {
      deal.related('products').sync(
        data.products.reduce((acc, current) => {
          return (acc = {
            ...acc,
            [current.productId]: { price: current.price, quantity: current.quantity },
          })
        }, {})
      )
    }

    deal.organizationId ? await deal.load('organization') : false

    await deal.load('user')
    await deal.load('stage')
    await deal.load('people')
    await deal.load('pipe')
    await deal.load('activities')
    await deal.load('customfields', (query) => {
      query.preload('customfield')
    })
    await deal.load('products', (query) => {
      query.pivotColumns(['price', 'quantity'])
    })

    if (Boolean(deal.user.sendNotificationWhatsapp) === true && deal.user.phone) {
      await Bull.add(new SendWhatsappNotification().key, { deal })
    }

    const integrations = await Integration.query()
      .where((query) =>
        query.where((query) =>
          query.whereHas('pipes', (query) => query.where('pipe_id', data.payload.pipeId!))
        )
      )
      .select()

    for (const integration of integrations) {
      if (integration.type === 'rd') {
        await Bull.add(new RdIntegration().key, { integration, customfields: data.customfields, deal })
      }

      if (integration.type === 'webhook') {
        await Bull.add(new WebhookIntegration().key, { integration, deal })
      }
    }
  }
}
