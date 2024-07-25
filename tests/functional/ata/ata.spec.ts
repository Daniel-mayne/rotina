import { test } from '@japa/runner'
import { User, Ata } from 'App/Models'

let user

test.group('Test - Ata', (group) => {
  group
    .tap((test) => test.tags(['@ata']))
    .each.setup(async () => {
      user = await User.find(1)
    })

  const route = '/atas'

  test('Should create ATA.', async ({ client }) => {
    const response = await client
      .post(route)
      .loginAs(user!)
      .json({
        title: 'Título da Nova Ata',
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(200)
  })

  test('Should not create ATA with invalid data.', async ({ client }) => {
    const response = await client
      .post(route)
      .loginAs(user!)
      .json({
        title: '', // title is required
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(422)
  })

  test('Should get all ATAs.', async ({ client }) => {
    const response = await client.get(route).loginAs(user!)

    response.assertStatus(200)
  })

  test('Should get ATA by ID', async ({ client }) => {
    const ata = await Ata.firstOrFail()

    const response = await client.get(`${route}/${ata.id}`).loginAs(user!)

    response.assertStatus(200)
  })

  test('Should not get ATA by invalid ID', async ({ client }) => {
    const response = await client.get(`${route}/999999`).loginAs(user!)

    response.assertStatus(404)
  })

  test('Should update ATA by ID', async ({ client }) => {
    const ata = await Ata.firstOrFail()

    const response = await client
      .put(`${route}/${ata.id}`)
      .loginAs(user!)
      .json({
        title: 'Título da Nova Ata update',
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(200)
  })

  test('Should  update ATA with  data', async ({ client }) => {
    const ata = await Ata.firstOrFail()

    const response = await client
      .put(`${route}/${ata.id}`)
      .loginAs(user!)
      .json({
        title: '',
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(200)
  })

  test('Should update ATA with  data 2', async ({ client }) => {
    const ata = await Ata.firstOrFail()

    const response = await client
      .put(`${route}/${ata.id}`)
      .loginAs(user!)
      .json({
        title: 'Titulo valido',
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(200)
  })

  test('Should not  update ATA with invalid data', async ({ client }) => {
    const ata = await Ata.firstOrFail()

    const response = await client
      .put(`${route}/${ata.id}`)
      .loginAs(user!)
      .json({
        title: 'AB',
        description: { key1: 'Ata de JAPA', key2: 'Teste' },
        customerId: 1,
        createdBy: 1,
      })

    response.assertStatus(422)
  })
})
