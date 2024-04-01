import { test } from '@japa/runner'

test.group('Ata', () => {
  let token
  test('Should log in successfully.', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'Daniel@rotina.digital',
      password: '16022012',
    })

    const responseBody = response.body()
    token = responseBody.token
  })

  test('Should create ATA.', async ({ client }) => {
    const response = await client
      .post('/atas')
      .header('Authorization', `Bearer ${token}`)
      .json({
        title: 'Título da Nova Ata',
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(200)
  })

  test('Should get all ATAs.', async ({ client }) => {
    const response = await client.get('/atas').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
  })

  test('Should get ATA by ID', async ({ client }) => {
    const response = await client.get('/atas/1').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
  })

  test('Should put ATA by ID', async ({ client }) => {
    const response = await client
      .put('/atas/1')
      .header('Authorization', `Bearer ${token}`)
      .json({
        title: 'Título da Nova Ata update',
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(200)
    response.dumpBody()
  })
})
