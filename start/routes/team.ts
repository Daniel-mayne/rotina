import Route from '@ioc:Adonis/Core/Route'

Route.resource('/teams', 'Team/Main')
  .apiOnly()
  .middleware({
    index: ['auth', 'acl:owner,administrator'],
    store: ['auth', 'acl:owner,administrator'],
    show: ['auth', 'acl:owner,administrator,user'],
    update: ['auth', 'acl:owner,administrator'],
    destroy: ['auth', 'acl:owner,administrator'],
  })
