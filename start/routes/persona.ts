import Route from '@ioc:Adonis/Core/Route'

Route.resource('/personas', 'Persona/Main')
    .apiOnly()
    .middleware({
        index: ['auth', 'acl:owner,administrator,user'],
        store: ['auth', 'acl:owner,administrator,user'],
        show: ['auth', 'acl:owner,administrator,user'],
        update: ['auth', 'acl:owner,administrator,user'],
        destroy: ['auth', 'acl:owner,administrator,user'],
    })

    Route.put('/personas/:id/restore', 'Persona/Main.restore').middleware(['auth', 'acl:owner,administrator,user'])
