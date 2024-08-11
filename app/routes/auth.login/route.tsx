import { LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { requireNotLoggedIn } from '~/services/auth';
import { cn } from '~/utils/css';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { schema } from './validation';
import { Field, FieldError, InputConform } from '~/components/form';
import { CheckboxConform } from '~/components/form/checkbox';

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
    <Form method="POST" id={form.id} onSubmit={form.onSubmit}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>

          <CardDescription>
            Enter your email and password below to login to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <Field>
            <Label
              htmlFor={fields.email.id}
              className={cn(fields.email.errors ? 'text-destructive' : '')}>
              Email
            </Label>

            <InputConform
              type="email"
              meta={fields.email}
              placeholder="e.g. john.doe@example.com"
              className={cn(
                'text-base',
                fields.email.errors
                  ? 'border-destructive text-destructive ring-destructive'
                  : ''
              )}
            />

            {fields.email.errors ? (
              <FieldError>{fields.email.errors}</FieldError>
            ) : null}
          </Field>

          <Field>
            <Label
              htmlFor={fields.password.id}
              className={cn(fields.password.errors ? 'text-destructive' : '')}>
              Password
            </Label>

            <InputConform
              type="password"
              meta={fields.password}
              className={cn(
                'text-base',
                fields.password.errors
                  ? 'border-destructive text-destructive ring-destructive'
                  : ''
              )}
            />

            {fields.password.errors ? (
              <FieldError>{fields.password.errors}</FieldError>
            ) : null}
          </Field>

          <Field className="flex flex-row items-center space-x-1">
            <CheckboxConform meta={fields.rememberMe} />

            <Label htmlFor={fields.rememberMe.id} className="cursor-pointer">
              Remember me
            </Label>
          </Field>

          {form.errors ? (
            <div>
              <FieldError>{form.errors}</FieldError>
            </div>
          ) : null}
        </CardContent>

        <CardFooter>
          <Button className="w-full">Sign in</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
