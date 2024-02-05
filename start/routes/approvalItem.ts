import Route from '@ioc:Adonis/Core/Route'

Route.resource('/approvalItems', 'ApprovalItem/Main')
    .apiOnly()
    .middleware({
        index: ['auth', 'acl:owner,administrator,user,guest'],
        store: ['auth', 'acl:owner,administrator,user'],
        show: ['auth', 'acl:owner,administrator,user,guest'],
        update: ['auth', 'acl:owner,administrator,user'],
        destroy: ['auth', 'acl:owner,administrator,user'],
    })

Route.put('/approvalItems/:id/restore', 'ApprovalItem/Main.restore').middleware(['auth', 'acl:owner,administrator,user'])
