import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Notification from 'App/Models/Notification'

export default class NotificationFilter extends BaseModelFilter {
    public $query: ModelQueryBuilderContract<typeof Notification, Notification>

    public status(status: string): void {
        this.$query.if(status !== 'all', (query) => query.whereIn('status', status.split(',')))
    }


    public approvalItemId(approvalItemIds: string) {
        this.$query.whereIn('approval_item_id', approvalItemIds.split(','))
    }

    public userId(userIds: string): void {
        this.$query.whereIn('user_id', userIds.split(','))
    }

    public commentId(commentIds: string): void {
        this.$query.whereIn('comment_id', commentIds.split(','))
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