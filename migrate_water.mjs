import pg from 'pg'

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:retvzVjPB3KvajJR@db.kbyutwwyrgiqkmiuadnq.supabase.co:5432/postgres'
})

async function run() {
  const client = await pool.connect()
  try {
    await client.query(`
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_water_ml integer DEFAULT 2000;
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.water_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          amount_ml INTEGER NOT NULL,
          logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `)

    await client.query(`
      ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
    `)
    
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_policies WHERE tablename = 'water_logs' AND policyname = 'Users can view own water logs'
          ) THEN
              CREATE POLICY "Users can view own water logs" ON public.water_logs FOR SELECT USING (auth.uid() = user_id);
              CREATE POLICY "Users can insert own water logs" ON public.water_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
              CREATE POLICY "Users can update own water logs" ON public.water_logs FOR UPDATE USING (auth.uid() = user_id);
              CREATE POLICY "Users can delete own water logs" ON public.water_logs FOR DELETE USING (auth.uid() = user_id);
          END IF;
      END
      $$;
    `)
    console.log("Water migration successful")
  } catch (err) {
    console.error("Migration failed:", err)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
