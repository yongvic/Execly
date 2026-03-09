# Execly - Full-Stack Marketplace Application

Welcome to Execly, a **complete, production-ready full-stack marketplace built with Next.js, TypeScript, and Prisma**.

## 🎯 What You're Getting

This is **not just a UI**—it's a fully functional marketplace with:

- ✅ Working backend API
- ✅ Secure JWT Authentication (with `jose`)
- ✅ Role-Based Access Control (RBAC)
- ✅ Database persistence (PostgreSQL + Prisma)
- ✅ Advanced Admin Space V2 (Dashboard, Datatables, Logs)
- ✅ Shopping cart & checkout
- ✅ Order management
- ✅ User dashboard
- ✅ Reviews & ratings
- ✅ Favorites system

Everything is ready to run locally in **under 2 minutes**.

---

## 📖 Documentation Guide

Choose where to start based on what you need:

### 1. **START_HERE.md** - Quick Start ⭐
- One-minute setup instructions
- Test account credentials
- Immediate testing guide
- Database configuration (Neon / PostgreSQL)

### 2. **README.md** - This File
- Complete project architecture
- Detailed feature list
- Design system information

### 3. **DEPLOY_VERCEL.md** - Production Deploy
- Full Vercel deployment checklist
- Required environment variables
- Payments webhook setup
- Realtime and Blob verification

---

## 🚀 Quick Start (2 Minutes)

### Install & Setup
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

### Execly v2 Variables
Copy `.env.example` to `.env` and fill at least:
- `DATABASE_URL`
- `AUTH_SECRET`
- `FLOOZ_API_URL`, `FLOOZ_API_TOKEN`
- `TMONEY_API_URL`, `TMONEY_API_TOKEN`
- `PAYMENT_WEBHOOK_SECRET`
- `BLOB_READ_WRITE_TOKEN`

Optional real-time:
- Preferred managed real-time (Pusher):
  - `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
  - `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`
- Fallback custom WebSocket:
  - `NEXT_PUBLIC_WS_URL` (if empty, UI falls back to polling).

Optional notifications:
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` for transactional emails
- `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN` for WhatsApp notifications

### Run Development Server
```bash
npm run dev
```

### Visit Application
```
http://localhost:3000
```

### Login with Test Accounts
- **User (Client)**: `user@example.com` / `password123`
- **Administrator**: `admin@example.com` / `password123` *(Grants access to `/admin/dashboard`)*

---

## 📚 Main Features

### For Users
- **Browse Services** - Search and filter by category/price
- **View Details** - See full service info, reviews, ratings
- **Shopping Cart** - Add/remove items with quantities
- **Checkout** - Multi-step flow with promo codes
- **Dashboard** - View orders, saved services, account settings

### For Administrators (Espace Admin V2)
- **Secure Access** - Edge-runtime JWT verification middleware protecting `/admin/*`.
- **Global Dashboard** - Interactive KPIs and Recharts analytics.
- **User Management** - Datatables to monitor and manage platform members.
- **Content Moderation** - Oversee services, orders, and platform content.
- **Security Logs** - Track critical events and administrative actions.

### For Developers
- **API Routes** - Fully functional endpoints
- **Database** - PostgreSQL with strict Enum typing for User Roles
- **Authentication** - Cryptographically secure JWT (`jose`) with HttpOnly cookies
- **TypeScript** - Fully typed codebase
- **Responsive Design** - Mobile-first approach Tailwind CSS v4

---

## 🏗️ Architecture

### Frontend Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Recharts (for Admin Analytics)

### Backend Stack
- Next.js API Routes (Serverless)
- Edge Middleware (for RBAC and route protection)
- `jose` for JSON Web Tokens
- bcryptjs password hashing

### Database Stack
- PostgreSQL (e.g., Neon Serverless Postgres)
- Prisma ORM
- Strict Enums (`Role: USER, ADMIN, MODERATOR, SUPER_ADMIN`)

---

## 📁 Project Structure

```
Execly/
├── app/
│   ├── (admin)/                # Secure Admin Space (Layout, Dashboard, Users...)
│   ├── api/                    # All API routes
│   ├── browse/page.tsx         # Service listing
│   ├── checkout/page.tsx       # Checkout flow
│   ├── dashboard/page.tsx      # User dashboard
│   ├── login/page.tsx          # Authentication
│   └── globals.css             # Global styles
├── components/
│   ├── admin/                  # Admin-specific UI components
│   └── ui/                     # shadcn components
├── lib/
│   ├── session.ts              # JWT generation/decryption logic
│   └── prisma.ts               # DB client
├── prisma/
│   ├── schema.prisma           # PostgreSQL Database schema
│   └── seed.ts                 # Sample data
├── START_HERE.md               # Setup guide
└── README.md                   # This file
```

---

## 🔐 Security & Best Practices

### Implemented ✅
- Cryptographically strong JWTs (HmacSHA256) via `jose` library.
- Password hashing with bcryptjs (10 rounds).
- Edge Runtime Middleware protecting sensitive routes (`/admin/*`).
- Role-Based Access Control enforced at the DB level (PostgreSQL Enums) and Middleware level.
- HttpOnly, secure (in production) cookies.
- User-specific data isolation.

---

## 🎨 Design System

### Colors
- Primary: #2563eb (blue)
- Accent: #f97316 (orange)
- Background: Glassmorphism integration in Admin Space.

### Typography
- Headings & Body: Modern sans-serif stack.

---

## 📞 Support & Troubleshooting

### Database Issues (Neon/PostgreSQL)
Ensure your `.env` contains a valid `DATABASE_URL`. If you encounter Prisma engine locks on Windows during migrations, temporarily stop the Next.js development server (`npm run dev`), run `npx prisma db push`, and restart.

If PowerShell blocks `npm` scripts, use `npm.cmd` instead (for example: `npm.cmd run dev`).

If you hit Prisma `spawn EPERM` on Windows:
1. Close running Node/Next processes.
2. Run terminal as Administrator.
3. Run `npx prisma generate`.
4. Run `npx prisma db push --accept-data-loss`.
5. Run `npm run db:seed`.

### Port Already in Use
```bash
npm run dev -- -p 3001
```

---

**Happy building! 🚀**

