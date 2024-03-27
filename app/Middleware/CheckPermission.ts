import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckPermission {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[]
  ) {
    const user = auth.user
    await user?.load((loader) => {
      loader.preload('departments')
    })
    const userDepartments = user?.departments.map((department) => department.id.toString())

    if (!allowedRoles.some((role) => userDepartments?.includes(role))) {
      return response.unauthorized({
        error: { message: 'Você não tem permissão para acessar esse recurso.' },
      })
    }
    await next()
  }
}
