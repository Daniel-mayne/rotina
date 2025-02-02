import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Customer } from 'App/Models'
import { StoreValidator, UpdateValidator, StoreTemporaryValidator } from 'App/Validators/Customer'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class CustomersController {
  public async index({ request, auth }: HttpContextContract) {
    const {
      limit = 10,
      page = 1,
      orderColumn = 'name',
      orderDirection = 'asc',
      ...input
    } = request.qs()

    return await Customer.filter(input)
      .where('companyId', auth.user!.companyId)
      .orderBy(orderColumn, orderDirection)
      .preload('users')
      .preload('company')
      .preload('accountManager')
      .preload('atas')
      .paginate(page, limit)
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const customer = await new Customer()
      .merge({
        ...data,
        companyId: auth.user!.companyId,
        createdBy: auth.user!.id,
        accountManagerId: auth.user!.id,
        fillingPercentage: 0.0,
        status: 'active',
      })
      .save()

    await customer.load((loader) => {
      loader.preload('users')
      loader.preload('company')
      loader.preload('accountManager')
    })
    return customer
  }

  public async uploadLogo({ request, auth, params }: HttpContextContract) {
    const fileData = await request.validate(StoreTemporaryValidator)

    const fs = require('fs')

    const originalFileName = fileData.file.clientName
      .replace(`.${fileData.file.extname}`, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const newName = `${originalFileName.replace(/\s/g, '-')}-${string.generateRandom(5)}.${
      fileData.file.extname
    }`
    const contentType = fileData.file.headers['content-type']
    const acl = 'public'

    const destinationPath = `companies/${auth.user!.companyId}/customer/${params.id}/${newName}`

    await Drive.put(destinationPath, fs.createReadStream(fileData.file.tmpPath), {
      contentType,
      acl,
      'Content-Length': fileData.file.size,
    })

    const updatedUrl = `${Env.get('S3_DOMAIN')}/${destinationPath}`

    const customer = await Customer.findOrFail(params.id)
    await customer.merge({ logo: updatedUrl }).save()

    return customer
  }

  public async show({ params, auth }: HttpContextContract) {
    const data = await Customer.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .preload('users')
      .preload('company')
      .preload('accountManager')
      .preload('atas')
      .firstOrFail()
    return data
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { userIds, ...data } = await request.validate(UpdateValidator)
    const customer = await Customer.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await customer.merge(data).save()

    if (userIds) await customer.related('users').sync(userIds.filter((id) => id))

    await customer.load((loader) => {
      loader.preload('users')
      loader.preload('company')
      loader.preload('accountManager')
      loader.preload('atas')
    })

    return customer
  }

  public async restore({ params, auth }: HttpContextContract) {
    const data = await Customer.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .andWhere('status', 'deleted')
      .firstOrFail()
    await data.merge({ status: 'active' }).save()

    return data
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const data = await Customer.query()
      .where('id', params.id)
      .andWhere('companyId', auth.user!.companyId)
      .firstOrFail()
    await data.merge({ status: 'deleted' }).save()
    return
  }
}
