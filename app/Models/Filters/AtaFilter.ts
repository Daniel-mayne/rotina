import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Ata from 'App/Models/Ata'

export default class AtaFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Ata, Ata>

  public search(word: string): void {
    this.$query.andWhereRaw('(title LIKE ? OR ata_description LIKE)', [`%${word}%`, `%${word}%`])
  }

  public title(title: string): void {
    this.$query.whereLike('title', `%${title}%`)
  }

  public projectDescription(projectDescription: string): void {
    this.$query.whereLike('ata_description', `%${projectDescription}%`)
  }

  public customer(ids: string): void {
    this.$query.whereIn('customer_id', ids.split(','))
  }

  public createdBy(createdBys: string): void {
    this.$query.whereIn('created_by', createdBys.split(','))
  }

  public createdAt(value: string) {
    const dates: string[] = value.split(',')
    const firstDate = DateTime.fromFormat(dates[0]!, 'dd/MM/yyyy').startOf('day').toSQL()
    const seccondDate = dates[1]
      ? DateTime.fromFormat(dates[1], 'dd/MM/yyyy').endOf('day').toSQL()
      : DateTime.fromFormat(dates[0]!, 'dd/MM/yyyy').endOf('day').toSQL()
    this.$query.whereBetween('created_at', [firstDate!, seccondDate!])
  }
}
