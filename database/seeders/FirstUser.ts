import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { Company } from 'App/Models'

export default class extends BaseSeeder {
  public async run() {
    const company = await Company.create({
      name: 'Rotina',
      userLimit: 9999,
      status: 'active',
    })

    // await company
    //   .related('lostReasons')
    //   .createMany([{ reason: 'Perdeu Interesse' }, { reason: 'Sem capital' }])

    // await company.related('customfields').createMany([
    //   { name: 'Email', context: 'deal', type: 'text' },
    //   { name: 'UTM Source', context: 'deal', type: 'text' },
    //   { name: 'UTM Medium', context: 'deal', type: 'text' },
    //   { name: 'UTM Campaign', context: 'deal', type: 'text' },
    //   { name: 'UTM Content', context: 'deal', type: 'text' },
    //   { name: 'UTM Term', context: 'deal', type: 'text' },
    // ])

    // await company
    //   .related('products')
    //   .create({ name: 'Produto Inicial', sku: 'xxxxxxxxx', price: 50 })

    const user = await company.related('users').create({
      name: 'Daniel',
      password: '08109250',
      phone: '(17) 99206-1486',
      email: 'Daniel@rotina.com.br',
      type: 'owner',
    })

    // const people = await company.related('peoples').create({
    //   name: 'Pessoa teste',
    //   userId: user.id,
    // })

    // const pipe = await user.related('pipes').create({
    //   name: 'Funil Inicial',
    //   status: 'active',
    //   companyId: company.id,
    // })

    // const stage = await pipe.related('stages').create({
    //   name: 'Estagio Inicial',
    //   description: 'Esse é o estágio inicial.',
    //   rottenFlag: true,
    //   rottenDays: 3,
    // })

    // await stage.related('deals').create({
    //   title: 'Negociação de teste',
    //   price: 100,
    //   peopleId: people.id,
    //   pipeId: pipe.id,
    //   userId: user.id,
    // })
  }
}
