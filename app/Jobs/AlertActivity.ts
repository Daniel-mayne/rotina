import { JobContract } from '@ioc:Rocketseat/Bull'
import { Notification, Activity } from 'App/Models'
import { DateTime } from 'luxon'
const axios = require('axios').default
import Env from '@ioc:Adonis/Core/Env'
/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class AlertActivity implements JobContract {
  public key = 'AlertActivity'

  public async handle(job) {
    const { data } = job
    const startDate = DateTime.now().plus({ minutes: 5 }).set({ second: 0 })
    const endDate = DateTime.now().plus({ minutes: 5 }).set({ second: 59 })

    const activities = await Activity.query()
      .whereBetween('start', [startDate.toSQL(), endDate.toSQL()])
      .andWhere('status', 'open')
      .preload('deal', query => query.preload('people'))
      .select()
  
    job.log(`${activities.length} atividades para as ${startDate.toSQL()}`)

    const instance = Env.get('ZAPI_INSTANCE', '')
    const token = Env.get('ZAPI_TOKEN', '')

    for await (const activity of activities) {

      await axios({
        method: 'POST',
        url: `https://api.z-api.io/instances/${instance}/token/${token}/send-text`,
        data: {
          "phone": `55${activity.deal.people.phone!.replace("+55", '').replace(/\D/g, '')}`,
          "message":  `Atenção sua atividade chamada '${activity.title}' é daqui 10 minutos.`,
          "delayMessage": 5,
          "delayTyping" : 5
        }
      })

      await Notification.create({
        title: 'Lembrete de atividade',
        description: `Atenção sua atividade chamada '${activity.title}' é daqui 10 minutos.`,
        link: `/deals/${activity.deal.id}`,
        type: 'activity',
        status: 'new',
        activityId: activity.id,
        userId: activity.userId,
        companyId: activity.companyId,
      })
    }
  }
}
