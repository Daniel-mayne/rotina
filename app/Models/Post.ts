import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Company, Customer, Feed, User } from 'App/Models'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { PostFilter } from './Filters'

{
  /**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           required: true
 *         name:
 *           type: string
 *           required: true
 *         postDate:
 *           type: string
 *           format: datetime
 *         status:
 *           type: string
 *           enum: [waiting_approval, approved, disapproved]
 *           required: true
 *           example: waiting_approval
 *         feedId:
 *           type: integer
 *         createdBy:
 *           type: integer
 *         companyId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: datetime
 *         updatedAt:
 *           type: string
 *           format: datetime
 *       required:
 *         - id
 *         - name
 *         - status
 *       example:
 *         id: 1
 *         name: "Post 1"
 *         status: "waiting_approval"
 *         feedId: 123
 *         createdBy: 456
 *         companyId: 789
 */

  /**
   * @swagger
   * paths:
   *   /posts:
   *     get:
   *       tags:
   *        - Post
   *       summary: Lista todas as postagens
   *       responses:
   *         '200':
   *           description: Lista de postagens obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Post'
   *     post:
   *       tags:
   *        - Post
   *       summary: Cria uma nova postagem
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       responses:
   *         '201':
   *           description: Postagem criada com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Post'
   *   /posts/{id}:
   *     get:
   *       tags:
   *        - Post
   *       summary: Obtém uma postagem por ID
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *             format: int64
   *             minimum: 1
   *       responses:
   *         '200':
   *           description: Postagem obtida com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Post'
   *     put:
   *       tags:
   *        - Post
   *       summary: Atualiza uma postagem por ID
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *             format: int64
   *             minimum: 1
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 status:
   *                   type: string
   *       responses:
   *         '200':
   *           description: Postagem atualizada com sucesso
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Post'
   *     delete:
   *       tags:
   *        - Post
   *       summary: Deleta uma postagem por ID
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *             format: int64
   *             minimum: 1
   *       responses:
   *         '204':
   *           description: Postagem deletada com sucesso
   */

}


export default class Post extends compose(BaseModel, Filterable) {

  public static $filter = () => PostFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({
    serialize: (value: DateTime) => {
      return value
    }
  })
  public postDate: DateTime

  @column()
  public status: 'waiting_approval' | 'approved' | 'disapproved'

  @column()
  public feedId: number

  @column()
  public createdBy: number

  @column()
  public companyId: number

  @belongsTo(() => Feed)
  public feeds: BelongsTo<typeof Feed>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
