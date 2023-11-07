import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Persona from 'App/Models/Persona'


export default class PersonaFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Persona, Persona>

  public status(status: string): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
  }

  public customer(ids: string): void {
    this.$query.whereIn('customer_id', ids.split(','))
  }

  public search(word: string): void {
    this.$query.andWhereRaw("(name LIKE ? OR description LIKE ? OR pains LIKE ? OR objections LIKE ?)", [`%${word}%`, `%${word}%`, `%${word}%`, `%${word}%`])
  }

  public name(name: string): void {
    this.$query.whereLike('name', `%${name}%`)
  }

  public description(description: string): void {
    this.$query.whereLike('description', `%${description}%`)
  }

  public pains(pains: string): void {
    this.$query.whereLike('pains', `%${pains}%`)
  }

  public objections(objections: string): void {
    this.$query.whereLike('objections', `%${objections}%`)
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