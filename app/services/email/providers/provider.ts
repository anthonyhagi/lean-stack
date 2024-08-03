export type SendEmailParams = {
  to: string;
  subject: string;
  /**
   * Set a custom FROM address if required. This should NOT be changed
   * from the default (specified in `services/constants.ts`) unless
   * absolutely required.
   */
  from?: string | undefined;
} & (
  | {
      // Must provide a html template and an optional text string
      html: string;
      text?: string | undefined;
    }
  | {
      // Must provide a text template and an optional html string
      text: string;
      html?: string | undefined;
    }
);

/**
 * All email providers need to be able to process the above
 * email sending parameters to be considered a "provider"
 * in the application.
 *
 * Each new provider must conform to the `EmailServiceProvider`
 * interface to work correctly.
 */
export interface EmailServiceProvider {
  sendEmail(params: SendEmailParams): Promise<void>;
}
