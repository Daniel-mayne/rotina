// import { test } from '@japa/runner'

// test.group('Authentication', () => {
//   test('Should login success', async ({ client }) => {
//     const response = await client.post('/auth/login').json({
//       email: 'Daniel@rotina.digital',
//       password: '16022012',
//     })

//     response.dumpBody()
//     .dumpCookies()
//     .dumpHeaders()
//   })

//   test('Should fail status 400', async ({ client }) => {
//     const response = await client.post('/auth/login').json({
//       email: 'Danielm@prospecta.digital',
//       password: '08109251',
//     })

//     response.assertStatus(400)
//   })
// })
