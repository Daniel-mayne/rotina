import { JobContract } from '@ioc:Rocketseat/Bull'
import { Customfield, Deal, Integration } from 'App/Models'
import Env from '@ioc:Adonis/Core/Env'
const axios = require('axios').default
// import DiscordLogger from '@ioc:Logger/Discord'

export default class SendRdStationIntegration implements JobContract {
  public key = 'RdIntegrations'

  public async handle(job) {
    const { data } = job

    const mailCf = await Customfield.query()
      .where('company_id', data.deal.user.companyId)
      .andWhereIn('name', ['Email', 'E-mail', 'email', 'e-mail', 'EMail', 'e-Mail'])
      .andWhere('context', 'deal')
      .first()

    if (data.deal.user.companyId === 300039) {
      await DiscordLogger.debug('mailCF', mailCf ? mailCf : undefined)
    }

    const integration = await Integration.query()
      .where('id', data.integration.id)
      .preload('fields')
      .firstOrFail()

    if (data.deal.user.companyId === 300039) {
      await DiscordLogger.debug('integration', integration)
      await DiscordLogger.debug(
        'if2',
        data.customfields?.map((cf) => cf.customfieldId).includes(mailCf.id)
      )
      await DiscordLogger.debug('if3', integration.token)
    }

    if (
      mailCf &&
      data.customfields?.map((cf) => cf.customfieldId).includes(mailCf.id) &&
      integration.token
    ) {
      if (data.deal.user.companyId === 300039) {
        await DiscordLogger.debug('entrou', 'if')
      }

      const refresh = await axios({
        method: 'post',
        url: 'https://api.rd.services/auth/token',
        data: {
          client_id: Env.get('RD_CLIENT_ID'),
          client_secret: Env.get('RD_CLIENT_SECRET'),
          refresh_token: integration.token,
        },
      })

      if (data.deal.user.companyId === 300039) {
        await DiscordLogger.debug('refresh', refresh.data)
      }

      let rdPayload = {
        event_type: 'CONVERSION',
        event_family: 'CDP',
        payload: {
          conversion_identifier: `Cubo (${data.deal.pipe.name})`,
          name: data.deal.title,
          tags: [data.deal.pipe.name, data.deal.user.name],
        },
      }

      if (integration.fieldPhone) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldPhone!]: data.deal.people.phone,
        }
      }

      if (integration.fieldStage) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldStage!]: data.deal.stage.name,
        }
      }

      if (integration.fieldPipe) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldPipe!]: data.deal.pipe.name,
        }
      }

      if (integration.fieldStatus) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldStatus!]: data.deal.status ? data.deal.status : 'active',
        }
      }

      if (integration.fieldPrice) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldPrice!]: data.deal.price ? `${data.deal.price}` : '0',
        }
      }

      if (integration.fieldUser) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldUser!]: data.deal.user.name,
        }
      }

      if (integration.fieldRating) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldRating!]: data.deal.rating,
        }
      }

      if (integration.fieldLostReason) {
        rdPayload.payload = {
          ...rdPayload.payload,
          [integration.fieldLostReason!]: data.deal.lostReason ? data.deal.lostReason.reason : null,
        }
      }

      if (data.customfields) {
        const cfs = data.customfields.filter((cf) => {
          const fields = integration.fields.map((field) => field.customfieldId)
          if (fields.includes(cf.customfieldId)) return cf
          return false
        })

        cfs.forEach((cf) => {
          const field = integration.fields.filter((c) => c.customfieldId === cf.customfieldId)[0]

          rdPayload.payload = {
            ...rdPayload.payload,
            [field.field]: cf.value,
          }
        })
      }

      if (data.deal.user.companyId === 300039) {
        await DiscordLogger.debug('payload', rdPayload)
      }

      const rd = await axios({
        method: 'post',
        url: 'https://api.rd.services/platform/events',
        data: rdPayload,
        headers: { Authorization: `Bearer ${refresh.data.access_token}` },
      }).catch(async function (error){
        if(data.deal.user.companyId === 300039){
          await DiscordLogger.debug('error1', error.response.data)
          await DiscordLogger.debug('error2', error.message)
          await DiscordLogger.debug('error3', error.request)
        }
      })

      if (data.deal.user.companyId === 300039) {
        await DiscordLogger.debug('result', rd)
      }
      const deal = await Deal.query().where('id', data.deal.id).firstOrFail()
      await deal.merge({ rdUuid: rd.data.event_uuid }).save()
    }
  }
}
