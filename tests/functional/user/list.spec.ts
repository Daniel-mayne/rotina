import { test } from '@japa/runner'

import { User, Company } from 'App/Models'

let company
let user

test.group('User list', (group) => {
  group
    .tap((test) => test.tags(['@user']))
    .each.setup(async () => {
      company = await Company.find(1)
      user = await User.find(1)
    })

  const route = '/users'

  test('Should create USER', async ({ client }) => {
    const response = await client.post(route).loginAs(user!).json({
      name: 'Daniel Bento',
      password: 'sucesso2030',
      passwordConfirmation: 'sucesso2030',
      phone: '17 991989587',
      email: 'Daniel101s@prospecta.digital',
      type: 'administrator',
    })
    response.assertStatus(200)
  })

  test('Should get all users.', async ({ client }) => {
    const response = await client.get(route).loginAs(user!)

    response.assertStatus(200)
  })
})
