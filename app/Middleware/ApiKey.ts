import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Apikey } from 'App/Models'

export default class ApiKey {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const key = auth.ctx.request.header('Authorization').replace('Bearer', '').trim()
    const apikey = await Apikey.query().where('value', key).preload('user').firstOrFail()
    await auth.loginViaId(apikey.user.id, { expiresIn: '10 minutes' })
    await next()
  }
}
