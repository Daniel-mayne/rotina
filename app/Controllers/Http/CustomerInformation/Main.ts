import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomerInformation } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/CustomerInformation'

export default class CustomerInformationController {
    public async index({ request, auth }: HttpContextContract) {
        const {
            limit = 10,
            page = 1,
            orderColumn = 'name',
            orderDirection = 'asc',
            ...input
        } = request.qs()

        return await CustomerInformation.filter(input)
            .where('id', auth.user!.companyId)
            .orderBy(orderColumn, orderDirection)
            .preload('customer')
            .paginate(page, limit)
    }

    public async store({request, auth}: HttpContextContract){
        const informationData = await request.validate(StoreValidator)
        const information = await new CustomerInformation()
        .merge({ ...informationData, companyId: auth.user!.companyId, createdBy: auth.user!.id, updateBy: auth.user!.id, status: 'active' })
        .save()

        await information.load(loader => loader.preload('customer'))
        return information
    }


}
