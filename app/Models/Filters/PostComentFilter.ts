import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import  PostComent  from 'App/Models/PostComent'

export default class PostComentFilter extends BaseModelFilter {
    public $query: ModelQueryBuilderContract<typeof PostComent, PostComent>
  
    public status (status: string ): void {
      this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
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