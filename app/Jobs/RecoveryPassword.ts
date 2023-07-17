import { JobContract } from '@ioc:Rocketseat/Bull'
import Mail from '@ioc:Adonis/Addons/Mail'
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

export default class RecoveryPassword implements JobContract {
  public key = 'RecoveryPassword'

  public async handle(job) {
    const { data } = job

    await Mail.use('sendgrid').send((message) => {
      message
        .from('no-reply@cubocrm.com.br', 'Cubo Suite')
        .to(data.user.email)
        .subject('Redefinir Senha')
        .htmlView('emails/forgot_password', { name: data.user.name, token: data.token })
    })

    return true
  }
}
