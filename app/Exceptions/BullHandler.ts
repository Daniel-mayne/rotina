import BullExceptionHandler from '@ioc:Rocketseat/Bull/BullExceptionHandler'
import { Job } from '@ioc:Rocketseat/Bull'
import Logger from '@ioc:Adonis/Core/Logger'

export default class JobExceptionHandler extends BullExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle (error: Error, job: Job) {
    this.logger.error(`key=${job.name} id=${job.id} error=${error.message}`)
  }
}