import Route from '@ioc:Adonis/Core/Route'

Route.post('/auth/login', 'Auth/Main.store')
Route.delete('/auth/logout', 'Auth/Main.destroy').middleware('auth')
Route.post('/auth/forgot-password', 'Auth/Main.recovery')
Route.post('/auth/change-password', 'Auth/Main.changePassword').middleware('auth')