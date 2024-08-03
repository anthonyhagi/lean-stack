import { env } from '../app';
import { EmailServiceProvider, SendEmailParams } from './providers';
import { SMTPProvider } from './providers/smtp';

/**
 * Set up a connection to the specified provider from the
 * environment variables.
 *
 * @returns a new provider that we can send an email from.
 */
function getEmailProvider(): EmailServiceProvider {
  const driver = env.MAIL_DRIVER;

  switch (driver) {
    case 'smtp':
      return new SMTPProvider({
        pool: env.MAIL_POOL || false,
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: env.MAIL_SECURE,
        auth: {
          user: env.MAIL_USERNAME,
          pass: env.MAIL_PASSWORD,
        },
      });

    default:
      throw new Error(
        `[FATAL]: EmailServiceProvider: '${driver}' is not set up correctly. Have you added it to the 'getEmailProvider()' function?`
      );
  }
}

/**
 * Handle sending a transactional email from the app.
 *
 * This function handles sending an email using the specified
 * parameters to the receiving address. We should not be
 * overriding the `from` address unless absolutely
 * necessary.
 *
 * @param params the values that should be attached to the
 * email that we are sending.
 *
 * @throws `Error` if a connection to the SMTP server was
 * not set up correctly (SMTP driver only).
 *
 * @throws `Error` if an email was unable to send
 * correctly (SMTP only).
 *
 * @throws `ErrorResponse` if an email was unable to send
 * correctly (Resend only).
 */
export async function sendEmail(params: SendEmailParams) {
  const provider = getEmailProvider();

  await provider.sendEmail(params);
}
