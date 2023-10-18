import Route from '@ioc:Adonis/Core/Route'

import './auth'
import './apikey'
import './company'
import './file'
import './user'
import './customer'
import './persona'
import './approval'
import './post'

Route.get('/', async () => {
  return { hello: 'world' }
})