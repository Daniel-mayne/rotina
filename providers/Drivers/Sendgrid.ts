import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid'
import { MailDriverContract, MessageNode } from '@ioc:Adonis/Addons/Mail'

/**
 * Config accepted by the driver
 */
export type SendGridConfig = {
  driver: 'sendgrid'
  apiKey: string
}

export class SendGridDriver implements MailDriverContract {
  private transporter: any

  constructor(private config: SendGridConfig) {
    /**
     * Instantiate the nodemailer transport
     */
    this.transporter = nodemailer.createTransport(sendgridTransport(this.config))
  }

  /**
   * Send email using the underlying transport
   */
  public async send(message: MessageNode) {
    return this.transporter.sendMail(message)
  }

  /**
   * Cleanup resources
   */
  public close() {
    this.transporter.close()
    this.transporter = null
  }
}
