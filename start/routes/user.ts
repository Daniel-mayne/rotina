import Route from '@ioc:Adonis/Core/Route'

Route.resource('/users', 'User/Main')
  .apiOnly()
  .middleware({
    index: ['auth', 'acl:owner,administrator'],
    store: ['auth', 'acl:owner,administrator,user'],
    show: ['auth', 'acl:owner,administrator,user'],
    update: ['auth', 'acl:owner,administrator,user'],
    destroy: ['auth', 'acl:owner,administrator'],
  })

Route.put('/users/:id/restore', 'User/Main.restore').middleware(['auth', 'acl:owner,administrator,user'])
