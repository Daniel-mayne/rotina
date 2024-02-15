import Route from '@ioc:Adonis/Core/Route'

import './auth'
import './apikey'
import './company'
import './file'
import './user'
import './customer'
import './persona'
import './approval'
import './approvalItem'
import './customerInformation'
import './postComment'
import './uploadLogoCustomer'
import './approvalItemFile'
import './approveAllItemsApproval'
import './taskTemplate'
import './projectTemplate'
import './project'

Route.get('/', async () => {
  return { hello: 'world' }
})
