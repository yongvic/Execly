# Execly - Project Context

## Overview
Execly is a professional services marketplace specifically designed for African entrepreneurs. It provides access to pre-made digital services like graphic design, professional templates, writing services, and web development.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Authentication**: Custom JWT-based authentication (using `bcryptjs` for hashing and `jose` for tokens)
- **Styling**: Tailwind CSS 4.0, Radix UI components (Shadcn UI style)
- **Internationalization**: `next-intl` with a custom provider (`lib/i18n.tsx`) and local messages (`lib/messages.ts`)
- **Payments**: Integrated with local Mobile Money providers (Flooz, TMoney)
- **Notifications**: 
  - Real-time: Pusher
  - Email: Resend
  - In-App: Database-backed
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Design System & Colors
The project uses a "Trust Blue" palette, designed to be professional and reliable, with a clean "Notion-like" feel.

### Light Mode (OKLCH)
- **Background**: `oklch(1 0 0)` (Pure White)
- **Foreground**: `oklch(0.25 0.05 250)` (Deep Slate Blue)
- **Primary**: `oklch(0.55 0.22 250)` (Trust Blue - #0066FF)
- **Secondary**: `oklch(0.95 0.04 240)` (Soft Sky Blue)
- **Accent**: `oklch(0.92 0.06 240)` (Bright Cyan-Blue)
- **Destructive**: `oklch(0.6 0.18 25)` (Soft Red)
- **Sidebar**: `oklch(0.98 0.01 240)` (Very Light Blue-Grey)

### Dark Mode
- **Background**: `oklch(0.12 0.03 240)` (Deep Midnight Blue)
- **Card/Popover**: `oklch(0.16 0.04 240)`

### Typography
- **Display**: var(--font-grotesk), Noto Sans (Sans-serif)
- **Sans**: var(--font-jakarta), Noto Sans (Sans-serif)
- **Mono**: JetBrains Mono

## Core Logic & Features
1. **Authentication**:
   - Login with email/phone.
   - Signup with full profile.
   - Password reset functionality via Resend.
2. **Internationalization (I18n)**:
   - Supports English (`en`) and French (`fr`).
   - Managed via `lib/messages.ts`.
3. **Marketplace Logic**:
   - Service browsing with categories and price ranges.
   - Shopping cart and favorites management.
   - Express delivery options.
4. **Order Lifecycle**:
   - PENDING -> CONFIRMED -> IN_PROGRESS -> COMPLETED -> CANCELLED.
   - Automatic confirmation via Mobile Money USSD triggers.
5. **Real-time Communication**:
   - Chat threads per order for client-provider communication.
   - Real-time notifications via Pusher.

## File Structure
- `app/`: Next.js pages and API routes.
- `components/`: UI and layout components.
- `lib/`: Core utilities (Prisma, Auth, I18n, Realtime, etc.).
- `prisma/`: Database schema and migrations.
- `public/`: Static assets and user uploads.
- `styles/`: Global CSS and Tailwind configuration.
