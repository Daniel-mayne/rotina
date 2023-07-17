import { JobContract } from '@ioc:Rocketseat/Bull'
import Env from '@ioc:Adonis/Core/Env'
const axios = require('axios').default

export default class SendWhatsappNotification implements JobContract {
  public key = 'SendWhatsappNotification'

  public async handle(job) {
    const { data } = job

    const instance = Env.get('ZAPI_INSTANCE', '')
    const token = Env.get('ZAPI_TOKEN', '')

    await axios({
      method: 'POST',
      url: `https://api.z-api.io/instances/${instance}/token/${token}/send-text`,
      data: {
        "phone": `55${data.deal.user.phone.replace("+55", '').replace(/\D/g, '')}`,
        "message": `🤑  *Novo lead*\n\n🤝🏻  ${data.deal.title} \n🏢  ${data.deal.organization ? data.deal.organization.name : 'Sem Organização'}\n📁  ${data.deal.pipe.name} \n🗂️  ${data.deal.stage.name}\n\n📞  ${data.deal.people.phone ? data.deal.people.phone.replace("+55", '') : 'Sem Telefone'}\n\n👆🏼  clique no número para falar`,
        "delayMessage": 5,
        "delayTyping" : 5
      }
    })

    // if(data.deal.people.phone){
    //   await axios({
    //     method: 'POST',
    //     url: `https://api.z-api.io/instances/${instance}/token/${token}/send-contact`,
    //     data: {
    //       "phone": `55${data.deal.user.phone.replace("+55", '').replace(/\D/g, '')}`,
    //       "contactName": data.deal.people.name,
    //       "contactPhone": `55${data.deal.people.phone.replace("+55", '').replace(/\D/g, '')}`,
    //       "delayMessage": 10
    //     }
    //   })

    // }

  }
}
