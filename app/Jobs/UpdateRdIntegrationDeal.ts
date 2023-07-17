import { JobContract } from '@ioc:Rocketseat/Bull'
import { Deal, Integration } from 'App/Models'
import Env from '@ioc:Adonis/Core/Env'
import JobExceptionHandler from 'App/Exceptions/BullHandler'
const axios = require('axios').default

export default class UpdateRdIntegrationDeal implements JobContract {
  public key = 'UpdateRdIntegrationDeal'

  public async handle(job) {

    const { data } = job
    const deal = await Deal.query().where('id', data.dealId).firstOrFail()
    await deal.load('customfields')
    
    if (
      data.mailCf &&
      deal.customfields?.map((cf) => cf.customfieldId).includes(data.mailCf.id) &&
      data.integration.token
    ) {

      const integration = await Integration.query()
      .where('id', data.integration.id)
      .preload('fields')
      .firstOrFail()

      const refresh = await axios({
        method: 'post',
        url: 'https://api.rd.services/auth/token',
        data: {
          client_id: Env.get('RD_CLIENT_ID'),
          client_secret: Env.get('RD_CLIENT_SECRET'),
          refresh_token: integration.token,
        },
      })

      await deal.load('pipe')
      await deal.load('user')

      let payload = {
        name: deal.title,
        tags: [deal.pipe.name.toLowerCase(), deal.user.name.toLowerCase()],
      }
 
      if (integration.fieldPhone) {
        await deal.load('people')
        payload = {
          ...payload,
          [integration.fieldPhone!]: `${deal.people.phone}`,
        }
      }

      if (integration.fieldStage) {
        await deal.load('stage')
        payload = {
          ...payload,
          [integration.fieldStage!]: `${deal.stage.name}`,
        }
      }
 
      if (integration.fieldPipe) {
        payload = {
          ...payload,
          [integration.fieldPipe!]: `${deal.pipe.name}`,
        }
      }
    
      if (integration.fieldStatus) {
        payload = {
          ...payload,
          [integration.fieldStatus!]: deal.status ? `${deal.status}` : 'open',
        }
      }
     
      if (integration.fieldPrice) {
        payload = {
          ...payload,
          [integration.fieldPrice!]: deal.price ? `${deal.price}` : '0',
        }
      }
  
      if (integration.fieldUser) {
        payload = {
          ...payload,
          [integration.fieldUser!]: `${deal.user.name}`,
        }
      }
     
      if (integration.fieldRating) {
        payload = {
          ...payload,
          [integration.fieldRating!]: `${deal.rating}`,
        }
      }

      if (integration.fieldLostReason) {
        await deal.load('lostReason')
        payload = {
          ...payload,
          [integration.fieldLostReason!]: deal.lostReason
            ? `${deal.lostReason.reason}`
            : null,
        }
      }
   
      integration.fields.forEach(integrationField =>{
        const customfield = deal.customfields.filter(cf => cf.customfieldId === integrationField.customfieldId)[0]
        if(customfield){
          payload = {
            ...payload,
            [integrationField.field]: `${customfield.value}`
          }
        }
      })

      let rd

      if (!data.oldMail) {
        const rd = await axios({
          method: 'post',
          url: 'https://api.rd.services/platform/events',
          data: {
            event_type: 'CONVERSION',
            event_family: 'CDP',
            payload: {
              ...payload,
              conversion_identifier: `Cubo (${deal.pipe.name})`,
            },
          },
          headers: { Authorization: `Bearer ${refresh.data.access_token}` },
        })

        return await deal.merge({ rdUuid: rd.data.event_uuid }).save()
      }

      const rdLead = await axios({
        method: 'GET',
        url: `https://api.rd.services/platform/contacts/email:${data.oldMail.value}`,
        headers: { Authorization: `Bearer ${refresh.data.access_token}` },
      }).catch((error) => {
        console.log(error.response.data.errors)
        throw new JobExceptionHandler()
      })


      if (rdLead?.data?.uuid) {
        await axios({
          method: 'patch',
          url: `https://api.rd.services/platform/contacts/${rdLead.data.uuid}`,
          data: payload,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refresh.data.access_token}`,
          },
        }).catch(function (error) {
          console.log(error.response.data.errors)
          throw new JobExceptionHandler()
        })
      }
    }
  }
}
