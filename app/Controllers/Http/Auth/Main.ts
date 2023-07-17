import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, Pipe } from 'App/Models'
import { request as graphqlRequest, gql } from 'graphql-request'
import { RecoveryPasswordValidator, ChangePasswordValidator } from 'App/Validators/Auth'
import Bull from '@ioc:Rocketseat/Bull'
import RecoveryPassword from 'App/Jobs/RecoveryPassword'

export default class UsersController {
  public async store({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      const token = await auth.attempt(email, password, { expiresIn: '30 days' })

      await token.user.load('company')
      await token.user.load('apiKeys')




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

      if (token.user.type === 'user' && token.user.company.stripeSubscriptionStatus === 'past_due') {
        return response.badRequest({
          errors: [{ message: 'Desativado por falta de pagamento, consulte seu administrador.' }],
        })
      }

      if (token.user.type === 'user') {
        await token.user.load('pipes', (query) => {
          query.preload('filters', (query) => {
            query.where('user_id', token.user.id)
          })
        })

        return {
          token: token.token,
          expiresAt: token.expiresAt,
          user: token.user,
        }
      }

      // const pipes = await Pipe.query()
      //   .where('company_id', token.user.companyId)
      //   .preload('filters', (query) => {
      //     query.where('user_id', token.user.id)
      //   })
      //   .select()

      // const pipesJson = pipes.map((post) => post.serialize())

      return {
        token: token.token,
        expiresAt: token.expiresAt,
        user: { ...token.user.serialize() },
      }
    } catch (exception) {
      console.log('exception')
    }

    const query = gql`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          name
          token
          company {
            id
          }
        }
      }
    `
    try {
      const login = await graphqlRequest('https://api.cubocrm.com.br', query, { email, password })
      const token = await auth.loginViaId(login.login.id, { expiresIn: '30 minutes' })

      const user = await User.query().where('id', login.login.id).firstOrFail()
      await user.merge({ companyId: login.login.company.id }).save()

      if (token.user.type === 'user') {
        await token.user.load('apiKeys')
        await token.user.load('pipes', (query) => {
          query.preload('filters', (query) => query.where('user_id', token.user.id))
        })

        return {
          token: token.token,
          expiresAt: token.expiresAt,
          user: token.user,
          newPassword: true,
        }
      }

      const pipes = await Pipe.query()
        .where('company_id', token.user.companyId)
        .preload('filters', (query) => {
          query.where('user_id', token.user.id)
        })
        .select()

      const pipesJson = pipes.map((post) => post.serialize())

      return {
        token: token.token,
        expiresAt: token.expiresAt,
        user: { ...token.user.serialize(), pipes: pipesJson },
        newPassword: true,
      }
    } catch (exception) {
      return response.badRequest({
        errors: [{ message: 'Usuário ou senha invalidos.' }],
      })
    }
  }

  public async recovery({ request, auth }: HttpContextContract) {
    const data = await request.validate(RecoveryPasswordValidator)

    const user = await User.query().where('email', data.email).firstOrFail()

    const token = await auth.loginViaId(user.id, {
      expiresIn: '1 hour',
    })

    await Bull.add(new RecoveryPassword().key, { user, token: token.token })
    return true
  }

  public async changePassword({ request, auth }: HttpContextContract) {
    const data = await request.validate(ChangePasswordValidator)

    const user = await User.query().where('id', auth.user!.id).firstOrFail()
    await user.merge({ password: data.password }).save()

    await auth.logout()

    const token = await auth.loginViaId(user.id, { expiresIn: '30 days' })
    await token.user.load('apiKeys')
    await token.user.load('company')

    if (token.user.type === 'user') {
      await token.user.load('pipes', (query) => {
        query.preload('filters', (query) => {
          query.where('user_id', token.user.id)
        })
      })

      return {
        token: token.token,
        expiresAt: token.expiresAt,
        user: token.user,
      }
    }

    const pipes = await Pipe.query()
      .where('company_id', token.user.companyId)
      .preload('filters', (query) => {
        query.where('user_id', token.user.id)
      })
      .select()

    const pipesJson = pipes.map((post) => post.serialize())

    return {
      token: token.token,
      expiresAt: token.expiresAt,
      user: { ...token.user.serialize(), pipes: pipesJson },
    }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
