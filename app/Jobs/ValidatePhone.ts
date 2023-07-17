import { JobContract } from '@ioc:Rocketseat/Bull'
const axios = require('axios').default
import Env from '@ioc:Adonis/Core/Env'
import { People } from 'App/Models'

export default class ValidatePhone implements JobContract {
  public key = 'ValidatePhone'

  public async handle(job) {
    const { data } = job

    const instance = Env.get('ZAPI_INSTANCE', '')
    const token = Env.get('ZAPI_TOKEN', '')

    const response = await axios({
      method: 'GET',
      url: `https://api.z-api.io/instances/${instance}/token/${token}/phone-exists/55${data.people.phone.replace(
        /\D/g,
        ''
      )}`,
    })

    const people = await People.query().where('id', data.people.id).firstOrFail()
    await people.merge({ validPhone: response.data.exists ? 'valid' : 'invalid' }).save()
  }
}
