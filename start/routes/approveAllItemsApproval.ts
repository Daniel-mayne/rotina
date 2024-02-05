import Route from '@ioc:Adonis/Core/Route'


Route.put('/approval/:id/all', 'ApprovalItem/Main.approveAll').middleware(['auth', 'acl:owner,administrator,user'])