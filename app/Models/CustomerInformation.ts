import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import {Customer, User, Company} from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { CustomerFilter } from './Filters'

export default class CustomerInformation extends compose(BaseModel, Filterable){

  public static $filter = () => CustomerFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public text: string

  @column()
  public type: 'text' | 'code' | 'image'

  @column()
  public language: string

  @column()
  public status?: 'active' | 'deactivated'

  @column()
  public isValid: boolean

  @column()
  public companyId: number


  @column()
  public customerId: number

  @column()
  public createdBy: number

  @column()
  public updateBy: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss');
    },
  })
  public updatedAt: DateTime;

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer> 

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>
}
