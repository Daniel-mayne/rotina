import Route from '@ioc:Adonis/Core/Route'

Route.resource('/customers', 'Customer/Main')
    .apiOnly()
    .middleware({
        index: ['auth', 'acl:owner,administrator,user'],
        store: ['auth', 'acl:administrator,user'],
        show: ['auth', 'acl:owner,administrator,user'],
        update: ['auth', 'acl:administrator,user'],
        destroy: ['auth', 'acl:administrator'],
    })
