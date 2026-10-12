import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, name, verificationUrl) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject: "Verify your Habitly email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h1 style="color: #f97316;">Welcome to Habitly, ${name}!</h1>

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

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject: "Reset your Habitly password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h1 style="color: #f97316;">Reset your Habitly password</h1>

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

  if (error) {
    throw new Error(error.message);
  }

  return data;
};