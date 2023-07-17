import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const { SendGridDriver } = await import('./Drivers/Sendgrid')
    const Mail = this.app.container.use('Adonis/Addons/Mail')

    Mail.extend('sendgrid', (_mail, _mapping, config) => {
      return new SendGridDriver(config)
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
