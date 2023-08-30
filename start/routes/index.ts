import Route from '@ioc:Adonis/Core/Route'

import './auth'
import './apikey'
import './company'
import './file'
import './user'
import './customer'

Route.get('/', async () => {
  return { hello: 'world' }
})