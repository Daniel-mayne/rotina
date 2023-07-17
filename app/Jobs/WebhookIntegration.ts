import { JobContract } from '@ioc:Rocketseat/Bull'
const axios = require('axios').default

export default class WebhookIntegration implements JobContract {
  public key = 'WebhookIntegration'

  public async handle(job) {
    const { data } = job
    job.log('Start')
    job.updateProgress(10)
    if(data.integration.url){
      job.log('Have URL')
      const response = await axios({
        method: 'post',
        url: data.integration.url,
        data: {
          deal: {...data.deal, type: data.type}
        },
      })
    }
    job.log('End')
    job.updateProgress(100)
  }
}
