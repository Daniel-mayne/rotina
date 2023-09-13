import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { RecoveryPasswordValidator, ChangePasswordValidator } from 'App/Validators/Auth'

export default class UsersController {
  public async store({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password, { expiresIn: '30 days' })

    await token.user.load(loader => loader.preload('company'))
    await token.user.load(loader => loader.preload('apiKeys'))

    if (token.user.company.status === 'waiting_activation') {
      return response.badRequest({
        errors: [{ message: 'Para entrar é necessario confirmar sua conta.' }],
      })
    }

    if (token.user.company.status === 'deactivated') {
      return response.badRequest({
        errors: [{ message: 'Empresa desativada' }],
      })
    }

    return {
      token: token.token,
      expiresAt: token.expiresAt,
      user: { ...token.user.serialize() },
    }
  }

  public async recovery({ request, auth }: HttpContextContract) {
    const data = await request.validate(RecoveryPasswordValidator)

    const user = await User.query().where('email', data.email).firstOrFail()

    const token = await auth.loginViaId(user.id, {
      expiresIn: '1 hour',
    })

    //TODO: Escrever a funcionalidade
    return true
  }

  public async changePassword({ request, auth }: HttpContextContract) {
    const data = await request.validate(ChangePasswordValidator)

    const user = await User.query().where('id', auth.user!.id).firstOrFail()
    await user.merge({ password: data.password }).save()

    await auth.logout()

    const token = await auth.loginViaId(user.id, { expiresIn: '30 days' })
    await token.user.load(loader => loader.preload('company'))

    return {
      token: token.token,
      expiresAt: token.expiresAt,
      user: token.user,
    }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
