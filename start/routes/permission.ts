import Route from '@ioc:Adonis/Core/Route'

Route.resource('/permissions', 'Permission/Main')
  .apiOnly()
  .middleware({
    index: ['auth', 'acl:owner,administrator'],
    store: ['auth', 'acl:owner,administrator'],
    show: ['auth', 'acl:owner,administrator'],
    update: ['auth', 'acl:owner,administrator'],
    destroy: ['auth', 'acl:owner,administrator'],
  })
