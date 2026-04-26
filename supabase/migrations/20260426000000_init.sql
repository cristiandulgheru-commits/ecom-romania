-- Magazin electronic / grădină — schema inițială (ROMÂNIA, RON)

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_ron numeric(12, 2) not null check (price_ron >= 0),
  image_url text,
  category text not null check (category in ('ceasuri', 'tablete', 'gradina', 'electronic')),
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text,
  address text,
  city text,
  payment_method text not null check (payment_method in ('ramburs', 'card')),
  items jsonb not null,
  total_ron numeric(12, 2) not null check (total_ron >= 0),
  status text not null default 'noua',
  created_at timestamptz default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Produse vizibile public" on public.products;
create policy "Produse vizibile public"
  on public.products for select
  using (true);

-- Comenzi doar prin service role / API (fără policy public)

-- Date demonstrative (imagini placeholder)
insert into public.products (slug, name, description, price_ron, image_url, category) values
(
  'ceas-lux-a1',
  'Ceas Chronograph Lux A1',
  'Carcasă inox, rezistență la apă 50m, afișaj analog. Ideal pentru birou și evenimente.',
  1299.00,
  'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
  'ceasuri'
),
(
  'ceas-smart-s7',
  'Smartwatch S7 Health',
  'Monitorizare puls, GPS, notificări. Baterie până la 5 zile.',
  899.00,
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
  'ceasuri'
),
(
  'tableta-pro-11',
  'Tabletă Pro 11" 128GB',
  'Ecran IPS, Wi-Fi, ideeală pentru lucru și multimedia. Garanție 2 ani.',
  2149.00,
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
  'tablete'
),
(
  'tableta-kids',
  'Tabletă Kids 8" educațională',
  'Carcă anti-șoc, aplicații educaționale preinstalate.',
  649.00,
  'https://images.unsplash.com/photo-1585790050230-5dd28404ccb7?w=800&q=80',
  'tablete'
),
(
  'masina-tuns-gazon',
  'Mașină tuns gazon electrică 42cm',
  'Coș 50L, înălțime reglabilă. Cablu 15m inclus.',
  1899.00,
  'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
  'gradina'
),
(
  'set-irigare',
  'Sistem irigare picătură 30m',
  'Timer, furtun flexibil, accesorii incluse. Economisește apă.',
  329.00,
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  'gradina'
),
(
  'aspirator-robot',
  'Aspirator robot smart',
  'Navigare laser, control aplicație, autonomie până la 120 min.',
  1599.00,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'electronic'
),
(
  'boxa-bluetooth',
  'Boxă Bluetooth 360°',
  'Sunet stereo, rezistență IPX7, baterie 12h.',
  449.00,
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  'electronic'
)
on conflict (slug) do nothing;
