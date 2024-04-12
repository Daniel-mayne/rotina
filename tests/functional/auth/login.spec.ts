import { test } from '@japa/runner'

let token

test.group('Authentication', (group) => {
  group.tap((test) => test.tags(['@auth']))

  test('Should login success', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD,
    })

    response.assertStatus(200)
    response.dumpBody().dumpCookies().dumpHeaders()

    token = response.body().token
  })

  test('Should fail status 400', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: process.env.INVALID_TEST_EMAIL,
      password: process.env.INVALID_TEST_PASSWORD,
    })

    response.assertStatus(400)
  })
})

export { token }
