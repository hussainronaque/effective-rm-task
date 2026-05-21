const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.APP_URL || 'http://localhost:3001'}/auth/verify?token=${token}`;

  const { error } = await resend.emails.send({
    from: 'Task Manager <onboarding@resend.dev>',
    to,
    subject: 'Verify your email – Task Manager',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Verify your email</h2>
        <p>Click the button below to activate your account:</p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:10px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;">
          Verify Email
        </a>
        <p style="margin-top:16px;color:#888;font-size:12px;">
          Or copy this link:<br/>${verifyUrl}
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('[Mailer] Resend error full:', JSON.stringify(error));
    throw new Error('Failed to send verification email');
  }

  console.log(`[Mailer] Verification email sent to ${to}`);
};

module.exports = { sendVerificationEmail };
