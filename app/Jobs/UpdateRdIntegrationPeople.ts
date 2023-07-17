import { JobContract } from '@ioc:Rocketseat/Bull'
import { People, Integration, Customfield } from 'App/Models'
import Env from '@ioc:Adonis/Core/Env'
import JobExceptionHandler from 'App/Exceptions/BullHandler'
const axios = require('axios').default

export default class UpdateRdIntegrationPeople implements JobContract {
  public key = 'UpdateRdIntegrationPeople'

  public async handle(job) {
    const { data } = job
    const people = await People.query().where('id', data.people.id).preload('deals').firstOrFail()

    for (const deal of people.deals) {
      const integrations = await Integration.query()
        .whereHas('pipes', (query) => query.where('pipe_id', deal.pipeId))
        .andWhere('type', 'rd')
        .select()

      await deal.load('customfields', (query) => query.preload('customfield'))

      const mailCf = await Customfield.query()
      .whereIn('name', ['Email', 'E-mail', 'email', 'e-mail', 'EMail', 'e-Mail'])
      .andWhere('context', 'deal')
      .first()

      if(integrations){
        if(mailCf){
          const email = deal.customfields.filter(cf => cf.customfieldId === mailCf.id)[0]
          if(email){
            for (const integration of integrations) {
              if(integration.fieldPhone){
                const refresh = await axios({
                  method: 'post',
                  url: 'https://api.rd.services/auth/token',
                  data: {
                    client_id: Env.get('RD_CLIENT_ID'),
                    client_secret: Env.get('RD_CLIENT_SECRET'),
                    refresh_token: integration.token,
                  },
                })

                let payload = {
                  [integration.fieldPhone]: `${people.phone}`
                }

                const rdLead = await axios({
                  method: 'GET',
                  url: `https://api.rd.services/platform/contacts/email:${email.value}`,
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

                return "Deal not found on RdStation"

              }

              return `Integration dont have fieldPhone`

            }
          }
  
          return `Dont have email customfield on deal ${deal.title}(${deal.id})`
  
        }
  
        return "Dont have email customfield"
        
      }

      return "Dont have integrations created"
    }
  }
}
