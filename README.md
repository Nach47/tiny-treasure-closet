# Tiny Treasure Closet

A premium baby & toddler clothing e-commerce platform: a customer-facing storefront plus a
full Admin Dashboard, built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.
Customers browse the catalog, check out with Mobile Money, and their order is handed off to
your business WhatsApp — while you manage products, orders, and store settings from a secure
dashboard.

## What's included

**Storefront:** Home, Shop (with filters/search/sort), Product, Category, Cart, Checkout,
Order Confirmation, Wishlist, About, Contact, FAQ, Privacy Policy, Terms & Conditions.

**Admin Dashboard** (`/admin`, login-protected):
- **Dashboard** — total orders, products, revenue, pending orders, low/out-of-stock alerts,
  today's and monthly sales, recent orders
- **Products** — add/edit/delete/duplicate/hide, drag-and-drop multi-image upload (from phone
  or computer), search, status filter, bulk activate/hide/delete
- **Orders** — pipeline by status (pending/paid/shipped/delivered/cancelled), search, CSV and
  Excel export, printable Invoice and Packing Slip, payment screenshot review, status updates
- **Settings** — business info & logo, WhatsApp number, social links, shipping fees, all three
  Mobile Money accounts, and editable categories — all changes apply to the live storefront
  immediately

**Behind the scenes:** stock automatically decrements when an order is placed (via a database
trigger), SEO metadata/JSON-LD/sitemap/robots.txt, and everything works on a bundled sample
catalog with zero setup so you can preview the whole thing before connecting a database.

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Supabase (Postgres, Auth,
Storage) · xlsx (Excel export)

## Getting started locally

```bash
npm install
cp .env.example .env.local   # then fill in what you have — see below
npm run dev
```

Open http://localhost:3000. Without Supabase credentials, the storefront runs on the bundled
sample catalog and the Admin Dashboard shows a "connect Supabase first" screen — every
storefront page is still fully browsable.

## Connecting Supabase (required for the Admin Dashboard)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor > New query** — paste all of `supabase/schema.sql` and run it. This creates:
   - `products`, `orders`, and `store_settings` tables
   - Row Level Security policies (public can read active products and create orders; only
     logged-in admins can read/write everything else)
   - A public `product-images` storage bucket and a private `payment-screenshots` bucket
   - A trigger that automatically decrements product stock when an order is placed
3. **Project Settings > API** — copy your **Project URL** and **anon public key** into
   `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. **Authentication > Users > Add user** — create your own admin login (email + password).
   There's deliberately no public sign-up page; every account created this way gets full
   admin access, so only add accounts for people who should have it.
5. Restart `npm run dev`, go to `/admin/login`, and sign in. From here, add your real products
   and configure Settings — no more editing the Table Editor by hand.

## Configuring WhatsApp, payments, and business info

Everything is editable two ways:
- **Before launch / as defaults:** environment variables (`.env.example` documents every one)
- **After launch:** the Admin Dashboard's Settings page, which overrides the env-var defaults
  and updates the live site immediately

**Note on payment screenshots:** WhatsApp's `wa.me` links can only pre-fill text — no website
can auto-attach a file to a WhatsApp message. The checkout page makes this clear and prompts
customers to re-attach their screenshot in the WhatsApp chat that opens. Separately, the
screenshot is uploaded straight to Supabase Storage and reviewable from each order's detail
page in the Admin Dashboard, so you don't have to rely on the WhatsApp attachment at all.

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. In the Vercel project's **Settings > Environment Variables**, add every variable from your
   `.env.local`.
4. Deploy. Vercel will give you a live `.vercel.app` URL immediately; add your own domain
   under **Settings > Domains** whenever you're ready.

## Project structure

```
app/
  (storefront)/        Storefront routes — Home, Shop, Product, Cart, Checkout, etc.
                        (route group: doesn't affect URLs, just groups the shared Header/Footer)
  admin/
    login/              Admin sign-in (no sidebar)
    sign-out/           Sign-out route handler
    orders/[id]/invoice, /packing-slip   Printable pages (no dashboard chrome)
    (dashboard)/        Everything behind the sidebar: dashboard, products, orders, settings
  layout.tsx            Root layout — fonts, providers only (no header/footer; see (storefront))
  sitemap.ts, robots.ts
components/             Storefront UI components
components/admin/       Admin Dashboard UI components
context/                Cart & wishlist state (persisted to localStorage)
lib/                    Types, Supabase clients, product/order/settings queries, WhatsApp builder
lib/admin/              Server-only admin queries (never bundled into client code)
middleware.ts           Protects all /admin routes, refreshes the Supabase session
supabase/schema.sql     Full database schema — run this in the Supabase SQL Editor
```

## What's next

The structure here already supports what's listed as future expansion in the original brief:
card/PayPal/Flutterwave/Paystack payments, discount coupons, gift cards, loyalty points,
referrals, email/SMS/push notifications, and order/delivery tracking. Each of these is an
additive change — new columns on `orders`/`store_settings`, a new admin section, and (for
payments) a new provider integration — rather than a restructuring of what's here.

