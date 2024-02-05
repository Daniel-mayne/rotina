import Route from '@ioc:Adonis/Core/Route'

Route.resource('/approvals', 'Approval/Main')
    .apiOnly()
    .middleware({
        index: ['auth', 'acl:owner,administrator,user,guest'],
        store: ['auth', 'acl:owner,administrator,user'],
        show: ['auth', 'acl:owner,administrator,user,guest'],
        update: ['auth', 'acl:owner,administrator,user'],
        destroy: ['auth', 'acl:owner,administrator,user'],
    })

Route.put('/approvals/:id/restore', 'Approval/Main.restore').middleware(['auth', 'acl:owner,administrator,user'])