import { JobContract } from '@ioc:Rocketseat/Bull'
import {
  Deal,
  Stage,
  People,
  Organization,
  User,
  Pipe,
  Notification
} from 'App/Models'
import Bull from '@ioc:Rocketseat/Bull'
import ValidatePhone from 'App/Jobs/ValidatePhone'
import DealService from 'App/Services/DealService'
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

export default class ImportDeal implements JobContract {
  public key = 'ImportDeal'

  public async handle(job) {
    const { data } = job

    job.log('Start Job')

    const pipe = await Pipe.query()
    .where('id', data.pipe.id)
    .preload('users')
    .preload('primary')
    .preload('stages')
    .firstOrFail()

    for (const row of data.sheetData) {
      const organization = row.organizationName
        ? await Organization.create({ name: row.organizationName, companyId: data.user!.companyId, userId: data.user!.id, })
        : null

      const people = await People.create({
        name: row.peopleName,
        phone: row.peoplePhone ? row.peoplePhone : null,
        organizationId: organization ? organization.id : null,
        userId: data.user!.id,
        companyId: data.user!.companyId,
        validPhone: row.peoplePhone ? 'validating' : undefined,
      })
      
      if (row.peoplePhone) {
        await Bull.add(new ValidatePhone().key, { people })
      }
      
      const customfields: Array<{ customfieldId: number; value: string }> = []
      
      Object.keys(row).forEach((k) => {
        if (!k.startsWith('cf_')) return
        const customfieldId = k.replace('cf_', '')
        customfields.push({ customfieldId: parseInt(customfieldId), value: `${row[k]}` })
      })
      
      let stageId = pipe.stages[0].id
      
      if (row.stageId) {
        const stage = await Stage.query()
        .where('id', row.stageId)
        .andWhere('pipe_id', pipe.id)
        .first()
        stageId = stage ? stage.id : pipe.stages[0].id
      }
      
      let duplicated
      let userId

      if (customfields && pipe?.primary) {
        const duplicatedData = await DealService.verifyDuplicated(pipe, customfields)
        
        if (duplicatedData) {
          duplicated = duplicatedData
          userId = duplicatedData.userId
        }
      }
      
      if(!duplicated){
        if (row.userId) {
          const user = await User.query()
          .where('id', row.userId)
          .andWhere('company_id', data.user!.companyId)
          .andWhereHas('pipes', (query) => query.where('pipe_id', pipe.id))
          .first()
          
          userId = user ? user.id : null
        }
        
        if (!row.userId) {
          userId = await DealService.getSplit(pipe)
        }
      }

      const payload = {
        pipeId: pipe.id,
        title: row.title,
        peopleId: people.id,
        organizationId: organization ? organization.id : organization,
        price: row.price ? row.price : null,
        stageId,
        userId,
        duplicatedId: duplicated ? duplicated.duplicatedId : null
      }
      
      const deal = await Deal.create(payload)
      
      if (customfields) {
        await deal.related('customfields').createMany(customfields)
      }
    }

    await Notification.create({
      title: 'Importação finalizada',
      description: `Sua importação foi finalizada.`,
      link: `/pipes/${pipe.id}`,
      type: 'import',
      status: 'new',
      userId: data.user.id,
      companyId: pipe.companyId,
    })
    job.log('Notification created')
  }
}
