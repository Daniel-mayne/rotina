import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Persona from 'App/Models/Persona'

export default class PersonaFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Persona, Persona>

  public status (status: string, auth: any ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')).whereIn('companyId', auth.user?.companyId))
  }
}
