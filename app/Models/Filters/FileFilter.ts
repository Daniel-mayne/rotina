import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import File from 'App/Models/File'

export default class FileFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof File, File>

  public status (status: string, auth: any ): void {
    this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')).whereIn('companyId', auth.user?.companyId))
  }
}
