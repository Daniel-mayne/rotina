import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { FileFilter } from './Filters'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
/**
* @swagger
* components:
*   schemas:
*     File:
*       type: object
*       properties:
*         id:
*           type: integer
*           format: int64
*         name:
*           type: string
*         extension:
*           type: string
*         size:
*           type: integer
*           format: int64
*         link:
*           type: string
*         companyId:
*           type: integer
*           format: int64
*         customerId:
*           type: integer
*           format: int64
*         createdBy:
*           type: integer
*           format: int64
*         createdAt:
*           type: string
*           format: date-time
*         updatedAt:
*           type: string
*           format: date-time
*         company:
*           $ref: '#/components/schemas/Company' 
*         user:
*           $ref: '#/components/schemas/User' 
*         customer:
*           $ref: '#/components/schemas/Customer'
*       required:
*         - id
*         - name 
*         - extension 
*         - size  
*         - link 
*         - companyId  
*         - customerId 
*         - createdBy 
*         - createdAt  
*         - updatedAt  
*       example:
*         id: 1
*         name: "Arquivo"
*         extension: "jpg"    
*         size: 30       
*         link: "https://teste.com"       
*         companyId: 2       
*         customerId: 2      
*         createdBy: 2       
*         createdAt: "2023-09-17T16:19:16.000-03:00"
*         updatedAt: "2023-09-17T16:35:40.000-03:00" 
*/



export default class File extends compose(BaseModel, Filterable) {

  public static $filter = () => FileFilter

  public static namingStrategy = new CamelCaseNamingStrategy()
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public extension: string

  @column()
  public size: number

  @column()
  public link: string

  @column()
  public companyId: number

  @column()
  public createdBy: number

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
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => User)
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>
}
