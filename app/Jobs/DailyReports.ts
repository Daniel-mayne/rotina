import { JobContract } from '@ioc:Rocketseat/Bull'
import { DateTime } from 'luxon'
import I18n from '@ioc:Adonis/Addons/I18n'
import { Deal, Pipe } from 'App/Models'
import Env from '@ioc:Adonis/Core/Env'
// import DiscordLogger from '@ioc:Logger/Discord'
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

export default class DailyReports implements JobContract {
  public key = 'DailyReports'

  public async handle(job) {
    const { data } = job

    job.log('Start of job')
    job.updateProgress(1)

    const pipes = await Pipe.query().whereNotNull('daily_reports').select()
    job.log('Pipes recovered')
    job.updateProgress(10)

    pipes.forEach(async (pipe) => {
      job.updateProgress(job.progress + (89 / pipes.length))
      job.log(`Iniciando ${pipe.name}`)
      const today = DateTime.now()

      const yesterdayStart = today.minus({ days: 1 }).startOf('day').toSQL()
      const yesterdayEnd = today.minus({ days: 1 }).endOf('day').toSQL()

      const monthStart = today.startOf('month').toSQL()
      const monthEnd = today.endOf('month').toSQL()

      const yesterdayDeals = await Deal.query()
        .whereBetween('created_at', [yesterdayStart, yesterdayEnd])
        .andWhere('pipe_id', pipe.id)
        .select()

      const monthDeals = await Deal.query()
        .whereBetween('created_at', [monthStart, monthEnd])
        .andWhere('pipe_id', pipe.id)
        .select()

      const rottenDeals = await Deal.query()
        .where('pipe_id', pipe.id)
        .andWhere('rotten', true)
        .select()

      const hottestDeals = await Deal.query()
        .where('pipe_id', pipe.id)
        .andWhereBetween('rating', [4, 5])
        .select()

      const createdYesterday = {
        total: yesterdayDeals.length,
        value: I18n.locale('pt').formatCurrency(
          yesterdayDeals.reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const openYesterday = {
        total: yesterdayDeals.filter((deal) => deal.status === 'open').length,
        value: I18n.locale('pt').formatCurrency(
          yesterdayDeals
            .filter((deal) => deal.status === 'open')
            .reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const wonYesterday = {
        total: yesterdayDeals.filter((deal) => deal.status === 'won').length,
        value: I18n.locale('pt').formatCurrency(
          yesterdayDeals
            .filter((deal) => deal.status === 'won')
            .reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const lostYesterday = {
        total: yesterdayDeals.filter((deal) => deal.status === 'lost').length,
        value: I18n.locale('pt').formatCurrency(
          yesterdayDeals
            .filter((deal) => deal.status === 'lost')
            .reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const createdThisMonth = {
        total: monthDeals.length,
        value: I18n.locale('pt').formatCurrency(
          monthDeals.reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const openThisMonth = {
        total: monthDeals.filter((deal) => deal.status === 'open').length,
        value: I18n.locale('pt').formatCurrency(
          monthDeals
            .filter((deal) => deal.status === 'open')
            .reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const wonThisMonth = {
        total: monthDeals.filter((deal) => deal.status === 'won').length,
        value: I18n.locale('pt').formatCurrency(
          monthDeals
            .filter((deal) => deal.status === 'won')
            .reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const lostThisMonth = {
        total: monthDeals.filter((deal) => deal.status === 'lost').length,
        value: I18n.locale('pt').formatCurrency(
          monthDeals
            .filter((deal) => deal.status === 'lost')
            .reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      const rotten = {
        total: rottenDeals.length,
        value: I18n.locale('pt').formatCurrency(
          rottenDeals.reduce((acc, value) => acc + value.price, 0),
          { currency: 'BRL' }
        ),
      }

      let hottestHTML = ''

      hottestDeals.forEach((deal) => {
        hottestHTML += `<div style="font-family: inherit; text-align: left"><span style="font-family: helvetica, sans-serif; font-size: 12px; color: #596681"><strong>- </strong></span><a href="https://app.cubosuite.com.br/deals/${deal.id}"><span style="font-family: helvetica, sans-serif; font-size: 12px; color: #596681"><strong>${deal.title}</strong></span></a></div>`
      })

      if (!hottestHTML) {
        hottestHTML = `<div style="font-family: inherit; text-align: left"><span style="font-family: helvetica, sans-serif; font-size: 14px; color: #596681"><strong>🤑 Nenhuma negociação quente em aberto.</strong></span></div>`
      }

      try{
        const sgMail = require('@sendgrid/mail')

        sgMail.setApiKey(Env.get('SENDGRID_API', ''))

        const email = await sgMail.send({
          to: pipe.dailyReports?.split(','),
          from: 'no-reply@cubocrm.com.br',
          templateId: 'd-869458b5ade146239581b3e2a9de3408',
          dynamicTemplateData: {
            pipeName: pipe.name,
            reportDay: today.setLocale('pt').toLocaleString(DateTime.DATE_MED),
            createdYesterday: createdYesterday.total,
            createdYesterdayValue: createdYesterday.value,
            openYesterday: openYesterday.total,
            openYesterdayValue: openYesterday.value,
            lostYesterday: lostYesterday.total,
            lostYesterdayValue: lostYesterday.value,
            wonYesterday: wonYesterday.total,
            wonYesterdayValue: wonYesterday.value,
            createdLastMonth: createdThisMonth.total,
            createdLastMonthValue: createdThisMonth.value,
            openLastMonth: openThisMonth.total,
            openLastMonthValue: openThisMonth.value,
            wonLastMonth: wonThisMonth.total,
            wonLastMonthValue: wonThisMonth.value,
            lostLastMonth: lostThisMonth.total,
            lostLastMonthValue: lostThisMonth.value,
            rotten: rotten.total,
            rottenValue: rotten.value,
            rottenLink: `https://app.cubosuite.com.br/pipes/${pipe.id}?rotten=true`,
            // rottenList: rottenHTML.replaceAll('undefined', ''),
            hottestList: hottestHTML.replaceAll('undefined', ''),
            link: `https://app.cubosuite.com.br/reports/company?startPage=true`,
          },
        })

        job.log(email)
        await DiscordLogger.debug('DailyReport', email)

      }catch(exception){
        job.log(exception)
      }

      job.log(`------------`)
    })

    job.log('End of job')
    job.updateProgress(100)
  }
}
