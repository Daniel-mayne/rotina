import Route from '@ioc:Adonis/Core/Route'

Route.resource('/approvalItems', 'ApprovalItem/Main')
    .apiOnly()
    .middleware({
        index: ['auth', 'acl:owner,administrator,user'],
        store: ['auth', 'acl:owner,administrator,user'],
        show: ['auth', 'acl:owner,administrator,user'],
        update: ['auth', 'acl:owner,administrator,user'],
        destroy: ['auth', 'acl:owner,administrator,user'],
    })