import * as aws from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { createTransport, Transporter } from 'nodemailer';
import SESTransport from 'nodemailer/lib/ses-transport';

import { DEFAULT_FROM_ADDRESS } from '../constants';
import { EmailServiceProvider, SendEmailParams } from './provider';

export class AWSSESProvider implements EmailServiceProvider {
  private transporter: Transporter<SESTransport.SentMessageInfo>;

  constructor() {
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: 'ap-southeast-2',
      credentialDefaultProvider: defaultProvider,
    });

    this.transporter = createTransport({ SES: { ses, aws } });

    // Ensure that the connection was established successfully.
    // If not, we can't proceed further as sending an email
    // will not work correctly.
    this.transporter.verify(function (error) {
      if (error) {
        throw error;
      }

      console.log(
        `[DEBUG]: AWS SES email server connection has been set up successfully`
      );
    });
  }

  /**
   * Handle sending an email with the provided parameters.
   *
   * This function will attach all of the required info into an
   * email and send it through AWS SES.
   *
   * @param params the parameters we want to attach to the email.
   */
  public async sendEmail(params: SendEmailParams): Promise<void> {
    const { from = DEFAULT_FROM_ADDRESS, ...rest } = params;

    const resp = await this.transporter.sendMail({ from, ...rest });

    console.log(
      `[DEBUG]: Sent an email successfully with id: ${resp.messageId}`
    );
  }
}
