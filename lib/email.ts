import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendResetPasswordEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/reset-password/${token}`
  
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Execly <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your password - Execly',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 600; margin-bottom: 16px;">Reset your password</h1>
        <p style="color: #475569; font-size: 16px; margin-bottom: 24px;">
          You requested to reset your password. Click the button below to set a new password.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          Execly - The all-in-one platform for your digital services.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send reset email:', error)
    return false
  }

  return true
}
