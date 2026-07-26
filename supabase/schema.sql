-- Tiny Treasure Closet — Core Storefront Schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New Query).
-- This covers the `products` table used by the storefront in this phase.
-- Orders, settings, and admin-user tables will ship with the Admin Dashboard
-- build and can be added to this same file later.

create extension if not exists "uuid-ossp";

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text default '',
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  category text not null,
  subcategory text,
  age_group text,
  sizes text[] default '{}',
  colors text[] default '{}',
  stock_quantity integer not null default 0,
  sku text unique,
  status text not null default 'active' check (status in ('active', 'hidden', 'draft')),
  weight_grams integer,
  images text[] default '{}',
  tags text[] default '{}',
  is_featured boolean default false,
  is_new_arrival boolean default false,
  is_best_seller boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_slug_idx on public.products (slug);

-- Keep updated_at current on every edit
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Row Level Security: the storefront uses the public anon key, so only
-- active products should ever be readable from the browser. Writes
-- (add/edit/delete/hide) will go through the Admin Dashboard's
-- authenticated Supabase session in the next build phase.
alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select
  using (status = 'active');

-- Storage bucket for product photos (create once; safe to re-run).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Optional: seed a couple of rows to verify the connection works.
-- Delete or edit these once you add real products from the Admin Dashboard.
insert into public.products
  (slug, name, description, price, category, age_group, sizes, colors, stock_quantity, sku, is_featured, is_new_arrival)
values
  (
    'cloud-knit-romper',
    'Cloud Knit Romper',
    'A featherlight knit romper in brushed organic cotton, finished with mother-of-pearl buttons.',
    185.00,
    'Newborn',
    '0–3 months',
    array['Preemie', 'Newborn', '0–3M'],
    array['Sage', 'Cream'],
    14,
    'TTC-NB-001',
    true,
    true
  )
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- Admin Dashboard tables — orders, store settings, and write access.
-- Run this section after the products section above (or all at once; every
-- statement below is safe to re-run).
-- ─────────────────────────────────────────────────────────────────────────

-- Orders --------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  items jsonb not null default '[]',
  subtotal numeric(10, 2) not null default 0,
  shipping_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  customer_name text not null,
  customer_phone text not null,
  customer_whatsapp text not null,
  customer_email text,
  delivery_address text not null,
  region text,
  city text not null,
  notes text,
  payment_method text not null,
  payment_screenshot_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

-- The storefront (anon key) may create an order at checkout, but may never
-- read, update, or delete any order — that's admin-only.
drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
  on public.orders for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
  on public.orders for delete
  using (auth.role() = 'authenticated');

-- Store settings --------------------------------------------------------------
-- Single-row table (id is always 1) holding everything editable from
-- Admin > Settings: business info, payment accounts, shipping, categories.
create table if not exists public.store_settings (
  id integer primary key default 1,
  business_name text not null default 'Tiny Treasure Closet',
  logo_url text,
  business_phone text,
  whatsapp_number text,
  whatsapp_display text,
  business_email text,
  business_address text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  google_maps_embed text,
  homepage_banner_text text,
  shipping_fee numeric(10, 2) not null default 25,
  free_shipping_threshold numeric(10, 2) not null default 400,
  payment_instructions text,
  mobile_money_accounts jsonb not null default '[]',
  categories jsonb not null default '[]',
  theme_colors jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at
  before update on public.store_settings
  for each row execute function public.set_updated_at();

alter table public.store_settings enable row level security;

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings"
  on public.store_settings for select
  using (true);

drop policy if exists "Admins can upsert store settings" on public.store_settings;
create policy "Admins can upsert store settings"
  on public.store_settings for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update store settings" on public.store_settings;
create policy "Admins can update store settings"
  on public.store_settings for update
  using (auth.role() = 'authenticated');

-- Seed the single settings row so the Admin Settings page has something to
-- edit immediately (values mirror .env.example — update them there instead).
insert into public.store_settings (id, business_name)
values (1, 'Tiny Treasure Closet')
on conflict (id) do nothing;

-- Admin write access to products -----------------------------------------------
-- The public read policy for products already exists above. Add write
-- policies so authenticated admin users can manage the catalog.
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete
  using (auth.role() = 'authenticated');

-- Admins also need to see hidden/draft products in the dashboard, not just
-- the public "active" ones.
drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
  on public.products for select
  using (auth.role() = 'authenticated');

-- Admin write access to product-images bucket ----------------------------------
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Payment screenshots bucket ----------------------------------------------------
-- Kept private (public = false): customers can upload their own payment
-- screenshot at checkout, but only authenticated admins can view them —
-- viewed via short-lived signed URLs generated in the admin orders pages.
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;

drop policy if exists "Public can upload payment screenshots" on storage.objects;
create policy "Public can upload payment screenshots"
  on storage.objects for insert
  with check (bucket_id = 'payment-screenshots');

drop policy if exists "Admins can view payment screenshots" on storage.objects;
create policy "Admins can view payment screenshots"
  on storage.objects for select
  using (bucket_id = 'payment-screenshots' and auth.role() = 'authenticated');

-- Automatic stock reduction ------------------------------------------------
-- Runs as SECURITY DEFINER so it can update `products` even though the
-- customer placing the order only has anon (insert-only) access — this is
-- the one deliberate, narrow bypass of RLS in this schema, scoped to
-- exactly this operation.
create or replace function public.decrement_stock_after_order()
returns trigger
security definer
set search_path = public
as $$
declare
  item jsonb;
begin
  for item in select * from jsonb_array_elements(new.items)
  loop
    update public.products
    set stock_quantity = greatest(0, stock_quantity - (item->>'quantity')::int)
    where id = (item->>'productId')::uuid;
  end loop;
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_decrement_stock on public.orders;
create trigger orders_decrement_stock
  after insert on public.orders
  for each row execute function public.decrement_stock_after_order();

-- ─────────────────────────────────────────────────────────────────────────
-- Creating your admin account
-- ─────────────────────────────────────────────────────────────────────────
-- Every policy above grants access based on auth.role() = 'authenticated' —
-- i.e. anyone who can log in has full admin access. Because this schema is
-- built for a single-owner store rather than a multi-tenant marketplace,
-- create accounts ONLY for people who should have full admin rights, and do
-- so from Supabase's dashboard rather than any public sign-up form (this
-- app deliberately has no public registration page):
--
--   Authentication > Users > Add user > enter your email and a password.
--
-- Then log in at /admin/login on your deployed site with those credentials.

