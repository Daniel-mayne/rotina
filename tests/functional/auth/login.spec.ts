import { test } from '@japa/runner'

test.group('Authentication', () => {
  test('Should login success', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'Daniel@rotina.com.br',
      password: '08109250',
    })

    response.assertStatus(200)
  })

  test('Should fail status 400', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'Daniel@rotina.com.br',
      password: '08109251',
    })

    response.assertStatus(400)
  })
})
