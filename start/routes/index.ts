import Route from '@ioc:Adonis/Core/Route'

import './approval'
import './approvalItem'
import './approvalItemFile'
import './apikey'
import './approveAllItemsApproval'
import './ata'
import './auth'
import './company'
import './customer'
import './customerInformation'
import './department'
import './file'
import './permission'
import './persona'
import './postComment'
import './project'
import './projectTemplate'
import './task'
import './taskTemplate'
import './team'
import './uploadLogoCustomer'
import './user'

Route.get('/', async () => {
  return { hello: 'world' }
})
