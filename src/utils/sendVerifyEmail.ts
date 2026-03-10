import { mailer } from "./mailer.js";

export async function sendVerifyEmail(args: {
  to: string;
  verifyUrl: string;
}) {
  const from = process.env.EMAIL_FROM ?? "no-reply@example.com";

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
      <h2>Verify your email</h2>
      <p>Click the button below to verify your email address.</p>
      <p>
        <a href="${args.verifyUrl}"
           style="display:inline-block;padding:12px 18px;border-radius:10px;text-decoration:none;background:#111;color:#fff">
          Verify email
        </a>
      </p>
      <p style="color:#666;font-size:12px">If you didn’t request this, you can ignore this email.</p>
    </div>
  `;

  await mailer.sendMail({
    from,
    to: args.to,
    subject: "Verify your email",
    html,
  });
}
