import { test } from '@japa/runner'

test.group('Ata', () => {
  let token
  test('Should login success', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'Daniel@rotina.digital',
      password: '16022012',
    })

    response.assertBody
  })

  test('create', async ({ client }) => {
    const response = await client.post('/atas').json({
      title: 'Título da Nova Ata',
      description: { key1: 'Ata de JAPA', key2: 'Teste' },
      customer_id: 1,
      created_by: 1,
    })

    response.assertStatus(200)
  })

  test('Get in All Atas', async ({ client }) => {
    const response = await client.get('/atas')

    console.log(response.body())
    console.log(response.status())
  })

  test('Get Ata by ID', async ({ client }) => {
    const response = await client.get('/atas/1')

    console.log(response.body())
    console.log(response.status())
  })
})
