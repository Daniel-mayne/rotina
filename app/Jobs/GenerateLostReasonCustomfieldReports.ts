import { JobContract } from '@ioc:Rocketseat/Bull'
import { Deal, CustomfieldDeal, LostReasonCustomfieldReport } from 'App/Models'
import { DateTime } from 'luxon'
// const Pusher = require('pusher')

// const pusher = new Pusher({
//   appId: '1522784',
//   key: '7fbd89e4e332742eb060',
//   secret: '394afed22ba8cfef2bfa',
//   cluster: 'sa1',
//   useTLS: true,
// })

export default class GenerateLostReasonCustomfieldReports implements JobContract {
  public key = 'GenerateLostReasonCustomfieldReport'

  public async handle(job) {
    const { data } = job

    job.log('Start of job 4')

    const report = await LostReasonCustomfieldReport.query().where('id', data.report.id).firstOrFail()

    job.log('Get report completed')

    job.log(`datas pré: ${data.report.startDate} - ${data.report.endDate}`)

    const start = DateTime.fromFormat(data.report.startDate, 'dd/MM/yyyy').startOf('day').toSQL()
    const end = DateTime.fromFormat(data.report.endDate, 'dd/MM/yyyy').endOf('day').toSQL()

    job.log(`datas: ${start} - ${end}`)
    job.updateProgress(10)

    for await (const lostreason of data.report.lostreasons) {
      const deals = await Deal.query()
        .where('pipe_id', report.pipeId)
        .andWhere('lost_reason_id', lostreason.id)
        .andWhereBetween('created_at', [start, end])
        .preload('customfields', query => query.preload('customfield'))
        .groupBy('id')

      job.log(`${deals.length} negociacões com motivos de perda ${lostreason.reason}`)

      let customfields = [] as CustomfieldDeal[]

      const withoutCF = deals.filter((deal) => {
        const cfs = deal.customfields.filter((cf) => cf.customfieldId === data.report.customfield.id)
        return cfs.length === 0
      })

      const withCF = deals.filter((deal) => {
        const cfs = deal.customfields.filter((cf) => cf.customfieldId === data.report.customfield.id)
        customfields = [...customfields, ...cfs]
        return cfs.length > 0
      })

      const totalWithoutCF = withoutCF.length
      // const openWithoutCF = withoutCF.filter((deal) => deal.status === 'open')
      // const wonWithoutCF = withoutCF.filter((deal) => deal.status === 'won')
      // const lostWithoutCF = withoutCF.filter((deal) => deal.status === 'lost')

      const uniqueValues = [
        ...new Set(customfields.map((c) => JSON.stringify({ value: c.value, id: c.customfieldId }))),
      ].map((string) => JSON.parse(string))

      const resultArray = [
        ...uniqueValues.map((value) => {

          const total = withCF.filter((deal) =>
            deal.customfields
              .map((cf) => {
                return JSON.stringify({ value: cf.value, id: cf.customfieldId })
              })
              .includes(JSON.stringify(value))
          ).length

          const totalRating = withCF.filter(
            (deal) =>
              // deal.status === 'open' &&
              deal.rating !== 0 &&
              deal.customfields
                .map((cf) => {
                  return JSON.stringify({ value: cf.value, id: cf.customfieldId })
                })
                .includes(JSON.stringify(value))
          ).length

          // const open = withCF.filter(
          //   (deal) =>
          //     deal.status === 'open' &&
          //     deal.customfields
          //       .map((cf) => {
          //         return JSON.stringify({ value: cf.value, id: cf.customfieldId })
          //       })
          //       .includes(JSON.stringify(value))
          // ).length

          // const lost = withCF.filter(
          //   (deal) =>
          //     deal.status === 'lost' &&
          //     deal.customfields
          //       .map((cf) => {
          //         return JSON.stringify({ value: cf.value, id: cf.customfieldId })
          //       })
          //       .includes(JSON.stringify(value))
          // ).length

          // const won = withCF.filter(
          //   (deal) =>
          //     deal.status === 'won' &&
          //     deal.customfields
          //       .map((cf) => {
          //         return JSON.stringify({ value: cf.value, id: cf.customfieldId })
          //       })
          //       .includes(JSON.stringify(value))
          // ).length

          const noRating = withCF.filter(
            (deal) =>
              // deal.status === 'open' &&
              deal.rating === 0 &&
              deal.customfields
                .map((cf) => {
                  return JSON.stringify({ value: cf.value, id: cf.customfieldId })
                })
                .includes(JSON.stringify(value))
          ).length

          const ratingAvarage =
            total !== noRating
              ? withCF
                .filter(
                  (deal) =>
                    deal.rating !== 0 &&
                    deal.customfields
                      .map((cf) => {
                        return JSON.stringify({ value: cf.value, id: cf.customfieldId })
                      })
                      .includes(JSON.stringify(value))
                )
                .reduce((a, b) => a + b.rating, 0) / totalRating
              : 0

          return {
            lostReasonId: lostreason.id,
            value: value.value,
            total,
            totalPercentage: Math.round((100 * total) / (withCF.length + totalWithoutCF)),
            // open,
            // openPercentage: Math.round((100 * open) / total),
            // lost,
            // lostPercentage: Math.round((100 * lost) / total),
            // won,
            // wonPercentage: Math.round((100 * won) / total),
            noRating: noRating,
            ratingAvarage: ratingAvarage ? ratingAvarage : 0,
          }
        }),
        {
          lostReasonId: lostreason.id,
          value: `Sem '${data.report.customfield.name}'`,
          total: totalWithoutCF,
          totalPercentage: totalWithoutCF
            ? Math.round((100 * totalWithoutCF) / (withCF.length + totalWithoutCF))
            : 0,
          // open: openWithoutCF.length,
          // openPercentage:
          //   openWithoutCF.length > 0 ? Math.round((100 * openWithoutCF.length) / totalWithoutCF) : 0,
          // lost: lostWithoutCF.length,
          // lostPercentage:
          //   lostWithoutCF.length > 0 ? Math.round((100 * lostWithoutCF.length) / totalWithoutCF) : 0,
          // won: wonWithoutCF.length,
          // wonPercentage:
          //   wonWithoutCF.length > 0 ? Math.round((100 * wonWithoutCF.length) / totalWithoutCF) : 0,
          noRating: withoutCF.filter((deal) => deal.rating === 0).length,
          ratingAvarage: Number.isNaN(
            Math.round(
              withoutCF.filter((deal) => deal.rating !== 0).reduce((a, b) => a + b.rating, 0) /
              withoutCF.filter((deal) => deal.rating !== 0).length
            )
          )
            ? 0
            : Math.round(
              withoutCF.filter((deal) => deal.rating !== 0).reduce((a, b) => a + b.rating, 0) /
              withoutCF.filter((deal) => deal.rating !== 0).length
            ),
        },
      ]

      await report.related('lines').createMany(resultArray)

    }

    await report.merge({ status: 'finished' }).save()

    pusher.sendToUser(`${report.userId}`, 'finish-customfield-export', {
      message: { report },
    })

    job.updateProgress(100)
    return true
  }

  public async onFailed(job) {
    const report = await LostReasonCustomfieldReport.query().where('id', job.data.report.id).firstOrFail()

    await report.merge({status: 'failed'}).save()

    await pusher.sendToUser(`${report.userId}`, 'finish-customfield-export', {
      message: { report: report },
    })
    job.log('Failed')
  }
}
