import { z } from 'zod';

const emailSchema = z.discriminatedUnion('MAIL_DRIVER', [
  z.object({
    MAIL_DRIVER: z.literal('aws-ses'),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
  }),

  z.object({
    MAIL_DRIVER: z.literal('resend'),
    MAIL_RESEND_API_KEY: z.string(),
  }),

  // The SMTP driver allows us to run against a local mail catcher,
  // hence allowing us to send as many emails as we'd like locally.
  // This uses `nodemailer` internally.
  z.object({
    MAIL_DRIVER: z.literal('smtp'),
    MAIL_HOST: z.string(),
    MAIL_PORT: z
      .string()
      .transform((s) => parseInt(s, 10))
      .pipe(z.number()),
    MAIL_SECURE: z
      .string()
      .default('false')
      .refine((s) => s === 'false' || s === 'true')
      .transform((s) => s === 'true'),
    MAIL_USERNAME: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    MAIL_POOL: z
      .string()
      .default('false')
      .refine((s) => s === 'false' || s === 'true')
      .transform((s) => s === 'true'),
  }),
]);

const environmentSchema = z
  .object({
    /**
     * The environment we are running the app in. For local development,
     * this should ideally match the `local`. Any other values it will
     * not accept.
     *
     * Required.
     *
     * @example `APP_ENV=local`
     */
    APP_ENV: z.enum(['local', 'test', 'development', 'staging', 'production']),

    /**
     * The base URL for where the app is hosted.
     *
     * This ideally should be `http://localhost:5173` when running this
     * locally to develop. When deployed, it should be the domain name
     * with `https://` at the start.
     *
     * @Required.
     *
     * @example `APP_URL=https://localhost:5173`
     */
    APP_URL: z.string().transform((url) => {
      if (!url.startsWith('http')) {
        return `https://${url}`;
      }

      return url;
    }),

    /**
     * The database URL will contain the username, password and all
     * other credentials we need to connect.
     *
     * This must be set up to run the app otherwise no operations
     * will work (e.g. logging in).
     *
     * By default, this template uses SQLite in development and
     * Turso in staging/production.
     *
     * Required.
     *
     * @example `DATABASE_URL="file:data/database.db"`
     */
    DATABASE_URL: z.string(),
    DATABASE_AUTH_TOKEN: z.string().optional(),

    /**
     * All secrets will be encrypted using the following key(s).
     * They should be provided with the format of: "one,two,etc"
     *
     * At minimum, you'll only need one key for each deployment.
     *
     * Required.
     *
     * @example `SESSION_SECRET="some-key-here,another-key-here`
     */
    SESSION_SECRET: z.string(),

    /**
     * By providing the following credentials, we will be able to
     * login with google. This is optional and does not need to
     * be set up as there are email/password logins.
     *
     * Optional.
     */
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    /**
     * The node environment we have set to run in. If we are developing,
     * we ideally want to use the `development` value. In testing, we
     * should use the `test`. In all other environments, we should
     * be using the `production` value.
     *
     * Required (although this should be set for you already).
     *
     * @example `NODE_ENV=production`
     */
    NODE_ENV: z.enum(['development', 'production', 'test']),
  })
  .and(emailSchema);

export const env = environmentSchema.parse(process.env);
