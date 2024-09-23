import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import { renderEmail } from '~/emails/render';

type PasswordResetEmailProps = {
  firstName: string;
  href: string;
};

export function PasswordResetEmail(props: PasswordResetEmailProps) {
  const { firstName, href } = props;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset your password</title>
      </Head>

      <Tailwind>
        <Body className="font-sans">
          <Container>
            <Section>
              <Heading as="h1" className="mb-4 text-3xl text-stone-900">
                Reset your password
              </Heading>

              <Text className="my-2 text-base text-stone-600">
                Hi {firstName},
              </Text>

              <Text className="mt-2 text-base text-stone-600">
                Please click on the link below to change your password. The link
                below is valid for the next 5 minutes.
              </Text>
            </Section>

            <Section className="my-2">
              <Button
                href={href}
                className="mb-0 inline-flex items-center justify-center rounded-lg bg-stone-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm">
                Change my password <span className="ml-1">&rarr;</span>
              </Button>
            </Section>

            <Section>
              <Text className="text-base text-stone-600">
                Can&apos;t use the link above? Copy and paste the following url
                into your browser to change your password:
              </Text>

              <Text className="font-mono text-sm text-stone-800">{href}</Text>
            </Section>

            <Section>
              <Text className="text-sm text-stone-500">
                You received this email because you requested to change your
                password. If you didn&apos;t request this change, you can safely
                ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function getPasswordResetEmail(params: PasswordResetEmailProps) {
  return await renderEmail(<PasswordResetEmail {...params} />);
}
