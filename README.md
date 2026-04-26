# ElektroRO

Magazin online (România): ceasuri de mână, tablete, grădină, electronică — **React (Vite)**, **Node** (API comenzi pe Vercel), **Supabase** (produse + comenzi).

- **Producție:** [https://ecom-romania.vercel.app](https://ecom-romania.vercel.app)  
- **GitHub:** [cristiandulgheru-commits/ecom-romania](https://github.com/cristiandulgheru-commits/ecom-romania)

## Dezvoltare locală

```bash
cp .env.example .env
# completează cheile Supabase, apoi:
npm install
npm run dev
```

API comenzi: `POST /api/orders` (middleware Vite + același handler ca pe Vercel).

## Supabase

Migrări: `supabase/migrations/`. Proiect legat: `supabase link` + `supabase db push`.

## Vercel

Variabile (Production): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

Poți conecta repo-ul GitHub din dashboard Vercel (Project → Settings → Git) pentru deploy la fiecare push.

## Licență

Proiect demonstrativ; adaptează termenii legali (GDPR, ANPC) înainte de producție reală.
