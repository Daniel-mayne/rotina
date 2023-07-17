import { JobContract } from '@ioc:Rocketseat/Bull'
import { Deal, Stage } from 'App/Models'
import { DateTime } from 'luxon'

export default class Rotten implements JobContract {
  public key = 'Rotten'

  public async handle(job) {
    const { data } = job

    const today = DateTime.now()

    const stages = await Stage.query()
      .where('rotten_flag', true)
      .andWhere('rotten_days', '>', 0)
      .if(data?.stageId, (query) => query.where('id', data.stageId))
      .whereHas('deals', (query) => query.where('status', 'open').andWhere('rotten', false))
      .select()

    for (const stage of stages) {
      const deals = await Deal.query()
        .where('stage_id', stage.id)
        .andWhere('status', 'open')
        .andWhere('rotten', false)
        .select()

      const rottenDeals = deals.filter((deal) => {
        const lastMove = deal.lastMove
          ? deal.lastMove.startOf('day')
          : deal.createdAt.startOf('day')
        const daysOff = today.diff(lastMove, 'days')
        return daysOff.days > stage.rottenDays!
      })

      const ids = rottenDeals.map((deal) => deal.id)
      await Deal.query().whereIn('id', ids).update({ rotten: true })
    }
  }
}
