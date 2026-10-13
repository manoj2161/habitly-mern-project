import { BrevoClient } from "@getbrevo/brevo";
import "dotenv/config";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sender = {
  name: "Habitly",
  email: process.env.EMAIL_FROM,
};

export const sendVerificationEmail = async (email, name, verificationUrl) => {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    sender,
    to: [
      {
        email,
        name,
      },
    ],
    subject: "Verify your Habitly email",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h1 style="color: #f97316;">
          Welcome to Habitly, ${name}!
        </h1>

        <p>
          Thanks for creating your Habitly account.
        </p>

        <p>
          Please verify your email address by clicking the button below:
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #f97316;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Verify Email
          </a>
        </div>

        <p>
          This verification link will expire in 30 minutes.
        </p>

        <p>
          If you did not create a Habitly account, you can safely ignore this email.
        </p>

        <p>
          — Habitly
        </p>
      </div>
    `,
  });

  return result;
};

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    sender,
    to: [
      {
        email,
        name,
      },
    ],
    subject: "Reset your Habitly password",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h1 style="color: #f97316;">
          Reset your Habitly password
        </h1>

        <p>
          Hi ${name},
        </p>

        <p>
          We received a request to reset the password for your Habitly account.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #f97316;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This password reset link will expire in 10 minutes.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>
          — Habitly
        </p>
      </div>
    `,
  });

  return result;
};
