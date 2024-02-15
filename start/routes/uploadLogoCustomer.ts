import Route from '@ioc:Adonis/Core/Route'

Route.post('/customers/logo', 'Customer/Main.uploadLogo').middleware([
  'auth',
  'acl:owner,administrator,user',
])
