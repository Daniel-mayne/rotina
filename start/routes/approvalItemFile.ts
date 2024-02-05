import Route from '@ioc:Adonis/Core/Route'


Route.post('/approvalItem/file', 'ApprovalItem/Main.approvalFile').middleware(['auth', 'acl:owner,administrator,user'])
