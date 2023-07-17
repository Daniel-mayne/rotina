import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import { JobContract } from '@ioc:Rocketseat/Bull'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { Deal, Export, Notification } from 'App/Models'

const Pusher = require('pusher')

const pusher = new Pusher({
  appId: '1522784',
  key: '7fbd89e4e332742eb060',
  secret: '394afed22ba8cfef2bfa',
  cluster: 'sa1',
  useTLS: true,
})

export default class DealExport implements JobContract {
  public key = 'DealExport'

  public async handle(job) {
    const { data } = job

    job.log('Start')

    job.log(`Export created by '${data.user.name}', with the filter '${data.filter.name}'`)

    const filters = data.filter.link
      .split('&')
      .filter((n) => n)
      .map((item) => {
        const filter = item.split('=')
        return { [filter[0]]: filter[1] }
      })
      .reduce((acc, item) => {
        return { ...acc, ...item }
      }, {})

    job.log('Array of filters done')
    job.log(filters)
    job.updateProgress(10)

    const deals = await Deal.query()
      .where('pipe_id', data.pipe.id)
      .if(filters.status && filters.status !== 'null' && filters.status !== 'undefined', (query) =>
        query.whereIn('status', filters.status.split(','))
      )
      .if(filters.rotten && filters.rotten !== 'null' && filters.rotten !== 'undefined', (query) => {
        query.where('rotten', filters.rotten === 'true' ? true : false)
      })
      .if(filters.rating && filters.rating !== 'null' && filters.rating !== 'undefined', (query) =>
        query.where('rating', filters.rating)
      )
      .if(filters.created_at && filters.created_at !== 'null' && filters.created_at !== 'undefined', (query) => {
        const dates = filters.created_at.split(',')
        const firstDate = DateTime.fromFormat(dates[0], 'dd/MM/yyyy').startOf('day').toSQL()
        const seccondDate = dates[1]
          ? DateTime.fromFormat(dates[1], 'dd/MM/yyyy').endOf('day').toSQL()
          : DateTime.fromFormat(dates[0], 'dd/MM/yyyy').endOf('day').toSQL()
        return query.whereBetween('created_at', [firstDate, seccondDate])
      })
      .if(filters.win_date && filters.win_date !== 'null' && filters.win_date !== 'undefined', (query) => {
        const dates = filters.win_date.split(',')
        const firstDate = DateTime.fromFormat(dates[0], 'dd/MM/yyyy').startOf('day').toSQL()
        const seccondDate = dates[1]
          ? DateTime.fromFormat(dates[1], 'dd/MM/yyyy').endOf('day').toSQL()
          : DateTime.fromFormat(dates[0], 'dd/MM/yyyy').endOf('day').toSQL()
        return query.whereBetween('win_date', [firstDate, seccondDate])
      })
      .if(filters.lost_date && filters.lost_date !== 'null' && filters.lost_date !== 'undefined', (query) => {
        const dates = filters.lost_date.split(',')
        const firstDate = DateTime.fromFormat(dates[0], 'dd/MM/yyyy').startOf('day').toSQL()
        const seccondDate = dates[1]
          ? DateTime.fromFormat(dates[1], 'dd/MM/yyyy').endOf('day').toSQL()
          : DateTime.fromFormat(dates[0], 'dd/MM/yyyy').endOf('day').toSQL()
        return query.whereBetween('lost_date', [firstDate, seccondDate])
      })
      .if(filters.peoples && filters.peoples !== 'null' && filters.peoples !== 'undefined', (query) =>
        query.whereIn('people_id', filters.peoples.split(','))
      )
      .if(filters.organizations && filters.organizations !== 'null' && filters.organizations !== 'undefined', (query) =>
        query.whereIn('organization_id', filters.organizations.split(','))
      )
      .if(
        filters.users && filters.users !== 'null' && filters.users !== 'undefined' && data.user!.type !== 'user',
        (query) => query.whereIn('user_id', filters.users.split(','))
      )
      .if(data.user!.type === 'user', (query) => query.where('user_id', data.user!.id))
      .if(filters.customfields && filters.customfields !== 'null' && filters.customfields !== 'undefined', (query) => {
        const cfs = filters.customfields.split(',')
        for (const cf of cfs) {
          const value = cf.split(':')
          query.whereHas('customfields', (query) =>
            query.where('customfield_id', value[0]).andWhere('value', value[1])
          )
        }

        return query
      })
      .preload('people')
      .preload('organization')
      .preload('lostReason')
      .preload('user')
      .preload('stage')
      .preload('customfields', query => query.preload('customfield'))
      .select()



    job.log(`${deals.length} deals recovered`)

    job.updateProgress(50)

    let dealsJson = deals
      .map((deal) => deal.serialize())
      .map((deal) => {
        job.updateProgress(job.progress + (20 / deals.length))

        const customfields = Object.fromEntries(
          deal.customfields.map((cf) => [cf.customfield.name, cf.value])
        )

        return {
          ...deal,
          peopleName: deal.people ? deal.people.name : null,
          peoplePhone: deal.people ? deal.people.phone : null,
          organizationName: deal.organization ? deal.organization.name : null,
          userName: deal.user ? deal.user.name : null,
          lostReason: deal.lostReason ? deal.lostReason.reason : null,
          stage: deal.stage ? deal.stage.name : null,
          ...customfields,
        }
      })

    job.log('JSON build completed')
    job.updateProgress(70)

    delete dealsJson.people
    delete dealsJson.organization
    delete dealsJson.customfields
    delete dealsJson.user
    delete dealsJson.lostReason
    delete dealsJson.stage

    const XLSX = require('xlsx')

    const wb = XLSX.utils.book_new()

    wb.Props = {
      Title: `Negociações do funil ${data.pipe.name} (${data.filter.name})`,
      Author: 'CuboSuite',
      CreateDate: new Date(),
    }

    wb.SheetNames.push('Exportação')

    const workSheet = XLSX.utils.json_to_sheet(dealsJson)
    wb.Sheets['Exportação'] = workSheet

    const buffer = await XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    const path = `reports/${data.user!.companyId}/exportacao_${data.pipe.name
      .replace(/\s/g, '_')
      .toLowerCase()}_${DateTime.now().toFormat('dd-MM-yyyy')}_${string.generateRandom(10)}.xlsx`

    job.log('SHEET build completed')
    job.updateProgress(80)

    await Drive.put(path, buffer)
    const oldExport = await Export.query().where('id', data.export.id).firstOrFail()
    await oldExport.merge({ link: `${Env.get('S3_DOMAIN', '')}/${path}`, status: 'finished' }).save()

    job.log('SHEET upload completed')
    job.updateProgress(90)

    await Notification.create({
      title: 'Exportação finalizada',
      description: `Sua exportação finalizou, clique para baixar`,
      link: `${Env.get('S3_DOMAIN', '')}/${path}`,
      type: 'export',
      status: 'new',
      exportId: oldExport.id,
      userId: oldExport.userId,
      companyId: oldExport.companyId,
    })

    await pusher.sendToUser(`${oldExport.userId}`, 'finish-export', {
      message: { export: oldExport },
    })

    job.log('Notification send')
    job.updateProgress(100)
  }

  public async onFailed(job) {
    const { data } = job

    const oldExport = await Export.query().where('id', data.export.id).firstOrFail()

    await oldExport.merge({ status: 'failed' }).save()

    await pusher.sendToUser(`${oldExport.userId}`, 'finish-export', {
      message: { export: oldExport },
    })

    job.log('Failed')
  }
}
