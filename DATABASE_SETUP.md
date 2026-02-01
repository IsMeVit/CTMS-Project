# Database Setup Guide

## Option 1: Using an Existing PostgreSQL Database

If your team already has a PostgreSQL database running, skip to "Run Schema Extensions" below.

---

## Option 2: Create Free PostgreSQL Database

### Neon (Recommended - Free Tier)
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project:
   - Name: `ctms`
   - Region: Choose closest to you
4. Copy the connection string from the dashboard:
   ```
   postgres://user:password@ep-xxx.region.neon.tech/ctms
   ```
5. Add to `.env`:
   ```env
   DATABASE_URL="postgres://user:password@ep-xxx.region.neon.tech/ctms?schema=public"
   ```

### Railway (Alternative)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the connection string from "Connect" tab
5. Add to `.env`

### Render (Alternative)
1. Go to https://render.com
2. Sign up with GitHub
3. Create a new PostgreSQL instance (Free tier)
4. Copy the connection string

---

## Run Schema Extensions

Connect to your database and run these SQL commands to add missing columns:

```sql
-- Add missing columns to movie table
ALTER TABLE public.movie ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.movie ADD COLUMN IF NOT EXISTS poster_url TEXT;
ALTER TABLE public.movie ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1);
ALTER TABLE public.movie ADD COLUMN IF NOT EXISTS release_date DATE;
ALTER TABLE public.movie ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add user_id to ticket (for user-specific bookings)
ALTER TABLE public.ticket ADD COLUMN IF NOT EXISTS user_id VARCHAR(100);

-- Add seat_type pricing multiplier (for VIP/Regular)
ALTER TABLE public.seat ADD COLUMN IF NOT EXISTS price_multiplier DECIMAL(3,2) DEFAULT 1.00;
```

### Run via psql
```bash
psql "YOUR_DATABASE_URL" -f schema-extensions.sql
```

### Run via Neon Console
1. Go to Neon dashboard → SQL Editor
2. Copy and paste the SQL above
3. Click "Run"

---

## Verify Connection

Test that your database is accessible:

```bash
# Install psql if needed (Linux)
sudo apt install postgresql-client

# Test connection
psql "YOUR_DATABASE_URL" -c "SELECT 1 as test;"
```

Expected output:
```
 test
-----
    1
(1 row)
```

---

## Next Steps

Once your database is set up and connection works:

1. Run `npx prisma init` (already done)
2. Run `npx prisma db push` to create tables
3. Run `npx prisma generate` to create TypeScript client

---

## Troubleshooting

### "Connection refused"
- Check if your IP is allowlisted (Neon requires IP allowlist)
- Verify hostname and port (5432)

### "Password authentication failed"
- Double-check your credentials
- Regenerate connection string if needed

### "Database does not exist"
- Create the database first, or use the default `postgres` database
- For Neon/Railway, the database is created automatically

### "Connection timed out"
- Check if your IP changed (dynamic IPs may need updating)
- Verify firewall settings
