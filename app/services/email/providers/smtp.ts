import { createTransport, type Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import SMTPPool from 'nodemailer/lib/smtp-pool';

import { DEFAULT_FROM_ADDRESS } from '../constants';
import type { EmailServiceProvider, SendEmailParams } from './provider';

// This is a simple configuration that should handle a majority
// of SMTP configurations. If there's something missing here,
// refer to the Nodemailer docs to add in the missing
// parameters.
type SMTPConfig = {
  pool: boolean;
  host: string;
  port: number;
  secure: boolean;
  auth?:
    | {
        user?: string | undefined;
        pass?: string | undefined;
      }
    | undefined;
};

export class SMTPProvider implements EmailServiceProvider {
  private transporter:
    | Transporter<SMTPPool.SentMessageInfo>
    | Transporter<SMTPTransport.SentMessageInfo>;

  constructor(config: SMTPConfig) {
    this.transporter = createTransport({ ...config });

    this.transporter.verify(function (error) {
      if (error) {
        throw error;
      } else {
        console.log(
          `[DEBUG]: SMTP email server connection has been set up successfully`
        );
      }
    });
  }

  /**
   * Handle sending an email with the provided parameters.
   *
   * This function will attach all of the required info into an
   * email and send it through SMTP.
   *
   * @param params the parameters we want to attach to the email.
   */
  public async sendEmail(params: SendEmailParams): Promise<void> {
    const { from = DEFAULT_FROM_ADDRESS, ...rest } = params;

    const resp = await this.transporter.sendMail({ from, ...rest });

    if (resp.messageId) {
      console.log(
        `[DEBUG]: Sent an email successfully with id: ${resp.messageId}`
      );
    }
  }
}
