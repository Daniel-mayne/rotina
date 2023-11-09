import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomerInformation } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/CustomerInformation'

export default class CustomerInformationController {
    public async index({ request, auth }: HttpContextContract) {
        const {
            limit = 10,
            page = 1,
            orderColumn = 'title',
            orderDirection = 'asc',
            ...input
        } = request.qs()

        return await CustomerInformation.filter(input)
            .where('companyId', auth.user!.companyId)
            .orderBy(orderColumn, orderDirection)
            .preload('customer')
            .paginate(page, limit)
    }

    public async store({ request, auth }: HttpContextContract) {
        const data = await request.validate(StoreValidator)
        const information = await new CustomerInformation()
            .merge({
                ...data,
                companyId: auth.user!.companyId,
                createdBy: auth.user!.id,
                status: 'active'
            })
            .save()

        await information.load(loader => {
            loader.preload('customer')
        })
        return information
    }

    public async show({ params, auth }: HttpContextContract) {
        const information = await CustomerInformation.query()
            .where('id', params.id)
            .andWhere('companyId', auth.user!.companyId)
            .preload('customer')
            .firstOrFail()
        return information
    }


    public async update({ params, request, auth }: HttpContextContract) {
        const data = await request.validate(UpdateValidator)
        const information = await CustomerInformation.query()
            .where('id', params.id)
            .andWhere('companyId', auth.user!.companyId)
            .firstOrFail()
        await information.merge({
            ...data, updateBy: auth.user!.id
        }).save()
        await information.load(loader => {
            loader.preload('customer')
        })

        return information
    }


    public async destroy({ params, auth }: HttpContextContract) {
        const information = await CustomerInformation.query()
            .where('id', params.id)
            .andWhere('companyId', auth.user!.companyId)
            .firstOrFail()

        return await information.delete()
    }

}
