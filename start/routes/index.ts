import Route from '@ioc:Adonis/Core/Route'

import './auth'
import './apikey'
import './company'
import './file'
import './user'

Route.get('/', async () => {
  return { hello: 'world' }
})