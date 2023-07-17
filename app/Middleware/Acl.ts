import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Acl {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[]
  ) {
    if (!allowedRoles.includes(auth.user?.type!)) {
      return response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }
    await next()
  }
}
