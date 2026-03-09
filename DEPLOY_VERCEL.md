# Deploy Execly on Vercel

## 1. Prerequisites
- A PostgreSQL database (Neon recommended)
- Vercel project connected to this repository
- Production secrets prepared

## 2. Required Environment Variables
Set these in Vercel Project Settings:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `PAYMENT_WEBHOOK_SECRET`
- `FLOOZ_API_URL`, `FLOOZ_API_TOKEN`
- `TMONEY_API_URL`, `TMONEY_API_TOKEN`
- `BLOB_READ_WRITE_TOKEN` (if file upload via Blob is used)
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (if email notifications are enabled)
- `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN` (if WhatsApp notifications are enabled)
- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER` (if realtime via Pusher is enabled)
- `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`

## 3. Build and Database
1. Ensure Prisma schema is up-to-date.
2. Deploy application.
3. Run migrations or `prisma db push` against production database during release process.
4. Seed only when needed and only with production-safe data.

## 4. Webhooks
- Configure payment provider callbacks to `https://<your-domain>/api/payments/webhook`
- Ensure webhook signature header (`x-signature`) is enabled on provider side.

## 5. Post-Deploy Checklist
- Login, signup, and reset-password flows
- Checkout initiation + OTP confirmation path
- Admin routes access control
- Newsletter and notifications routes
- Realtime events (if enabled)
