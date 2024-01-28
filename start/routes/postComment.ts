import Route from '@ioc:Adonis/Core/Route'

Route.resource('/postComments', 'PostComment/Main')
    .apiOnly()
    .middleware({
        index: ['auth', 'acl:owner,administrator,user,guest'],
        store: ['auth', 'acl:owner,administrator,user,guest'],
        show: ['auth', 'acl:owner,administrator,user,guest'],
        update: ['auth', 'acl:owner,administrator,user,guest'],
        destroy: ['auth', 'acl:owner,administrator,user,guest'],
    })