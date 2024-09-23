import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';

import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

import { Field, FieldError } from '~/components/form/field';
import { InputConform } from '~/components/form/input';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { getPasswordResetEmail } from '~/emails/auth/password-reset/email';
import { userPasswordChangeRequests } from '~/schema/user-password-change-requests';
import { getAbsoluteUrl } from '~/services/app';
import { requireNotLoggedIn } from '~/services/auth';
import { db } from '~/services/db';
import { sendEmail } from '~/services/email';
import { getUser } from '~/services/user';
import { cn } from '~/utils/css';
import { assert } from '~/utils/helpers';

import { schema } from './validation';

export async function action({ request }: ActionFunctionArgs) {
  await requireNotLoggedIn(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  try {
    // Create a unique signature that we will verify when the user
    // clicks the button in the email or uses the link. This will
    // ensure that they have access to the specified email account
    const user = assert(await getUser({ email: submission.value.email }));
    const signature = randomBytes(20).toString('hex').trim();

    // We only want to commit the password change request when the
    // email is sent correctly. Otherwise, if we don't do this
    // we'll have stray or lots of unused password change
    // requests sitting in the database.
    await db.transaction(async (tx) => {
      await tx.insert(userPasswordChangeRequests).values({
        code: signature,
        userId: user.id,
        active: true,
        expiresAt: addMinutes(new Date().toISOString(), 5).toISOString(),
      });

      const url = getAbsoluteUrl(
        `/auth/update-password?signature=${signature}`
      );

      const { html, text } = await getPasswordResetEmail({
        firstName: user.firstName,
        href: url,
      });

      await sendEmail({
        to: 'info@anthonyhagi.com.au',
        html,
        text,
        subject: 'Password reset email',
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[ERROR]: ${error.message}`);
      console.error(error);
    } else {
      console.error(error);
    }
  }

  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireNotLoggedIn(request);

  return null;
}

export default function Page() {
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>
          Enter your email address below and if you have an account, you&apos;ll
          receive a password reset email
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form
          method="POST"
          id={form.id}
          onSubmit={form.onSubmit}
          className="grid gap-4">
          <Field>
            <Label
              htmlFor={fields.email.id}
              className={cn(fields.email.errors ? 'text-destructive' : '')}>
              Email
            </Label>

            <InputConform
              type="email"
              placeholder="e.g. john.doe@example.com"
              meta={fields.email}
              className={cn(
                fields.email.errors
                  ? 'border-destructive text-destructive ring-destructive'
                  : ''
              )}
            />

            {fields.email.errors ? (
              <FieldError>{fields.email.errors}</FieldError>
            ) : null}
          </Field>

          <Button>Submit</Button>
        </Form>

        <div className="my-4">
          <hr />
        </div>

        <div className="flex w-full flex-col">
          <Link to="/auth/login">
            <Button variant="outline" className="group w-full">
              Go to login{' '}
              <span className="ml-1 transition group-hover:translate-x-0.5">
                &rarr;
              </span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
