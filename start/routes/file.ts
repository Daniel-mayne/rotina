import Route from '@ioc:Adonis/Core/Route'


Route.get('/files', 'File/Main.index').middleware(['auth', 'acl:owner,administrator,user'])
Route.post('/files', 'File/Main.store').middleware(['auth', 'acl:owner,administrator,user'])
Route.post('/files/tmp', 'File/Main.temporaryStore').middleware(['auth', 'acl:owner,administrator,user'])
Route.delete('/files', 'File/Main.destroy').middleware(['auth', 'acl:owner,administrator,user'])