import Route from '@ioc:Adonis/Core/Route'

Route.resource('/customers', 'Customer/Main')
  .apiOnly()
  .middleware({
    index: ['auth', 'acl:owner,administrator,user'],
    store: ['auth', 'acl:owner,administrator,user'],
    show: ['auth', 'acl:owner,administrator,user'],
    update: ['auth', 'acl:owner,administrator,user'],
    destroy: ['auth', 'acl:owner,administrator,user'],
  })

Route.put('/customers/:id/restore', 'Customer/Main.restore').middleware([
  'auth',
  'acl:owner,administrator,user',
])

Route.post('/customers/:id/logo', 'Customer/Main.uploadLogo').middleware([
  'auth',
  'acl:owner,administrator,user',
])
