import { Resend } from 'resend';

import { DEFAULT_FROM_ADDRESS } from '../constants';
import { EmailServiceProvider, SendEmailParams } from './provider';

export class ResendProvider implements EmailServiceProvider {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  /**
   * Handle sending an email with the provided parameters.
   *
   * This function will attach all of the required info into an
   * email and send it through the Resend api.
   *
   * @param params the parameters we want to attach to the email.
   *
   * @throws `ErrorResponse` if an email fails to send.
   */
  public async sendEmail(params: SendEmailParams): Promise<void> {
    const { from = DEFAULT_FROM_ADDRESS, ...rest } = params;

    const { data, error } = await this.resend.emails.send({ from, ...rest });

    if (error) {
      throw error;
    }

    if (data) {
      console.log(`[DEBUG]: Sent an email successfully with id: ${data?.id}`);
    }
  }
}
