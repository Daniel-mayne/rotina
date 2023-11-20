import Route from '@ioc:Adonis/Core/Route'


    Route.put('/approve/all/:id', 'ApprovalItem/Main.approveAll').middleware(['auth', 'acl:owner,administrator,user'])