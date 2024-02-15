import Route from '@ioc:Adonis/Core/Route'

Route.resource('/companies', 'Company/Main')
  .apiOnly()
  .middleware({
    index: ['auth', 'acl:owner,administrator'],
    store: [],
    show: ['auth', 'acl:owner,administrator'],
    update: ['auth', 'acl:owner,administrator'],
    destroy: ['auth', 'acl:owner,administrator'],
  })

Route.post('/company/confirm', 'Company/Main.activeAccount').middleware([
  'auth',
  'acl:owner,administrator,user',
])
Route.post('/company/sendInvoice', 'Company/Main.sendInvoice').middleware([
  'auth',
  'acl:owner,administrator',
])
Route.post('/company/checkout', 'Company/Main.createCheckout').middleware([
  'auth',
  'acl:owner,administrator',
])
Route.get('/company/billing', 'Company/Main.createBilling').middleware([
  'auth',
  'acl:owner,administrator',
])
