import Route from '@ioc:Adonis/Core/Route'

Route.resource('/departments', 'Department/Main')
  .apiOnly()
  .middleware({
    index: ['auth', 'acl:owner,administrator,user'],
    store: ['auth', 'acl:owner,administrator'],
    show: ['auth', 'acl:owner,administrator,user'],
    update: ['auth', 'acl:owner,administrator'],
    destroy: ['auth', 'acl:owner,administrator'],
  })
