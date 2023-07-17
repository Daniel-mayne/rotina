import Route from '@ioc:Adonis/Core/Route'

// Route.resource('/files', 'File/Main')
//   .apiOnly()
//   .middleware({
//     index: ['auth', 'acl:owner,administrator,user'],
//     store: ['auth', 'acl:owner,administrator,user'],
//     show: ['auth', 'acl:owner,administrator,user'],
//     update: ['auth', 'acl:owner,administrator,user'],
//     destroy: ['auth', 'acl:owner,administrator'],
//   })

Route.get('/files', 'File/Main.index').middleware(['auth', 'acl:owner,administrator,user'])
Route.post('/files', 'File/Main.store').middleware(['auth', 'acl:owner,administrator,user'])
Route.post('/files/tmp', 'File/Main.temporaryStore').middleware(['auth', 'acl:owner,administrator,user'])