import pg from 'pg'

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:retvzVjPB3KvajJR@db.kbyutwwyrgiqkmiuadnq.supabase.co:5432/postgres'
})

async function run() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.chat_sessions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL DEFAULT 'Новий чат',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
    `)
    
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Users can view own chat sessions'
          ) THEN
              CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
              CREATE POLICY "Users can insert own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
              CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
              CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);
          END IF;
      END
      $$;
    `)

    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='session_id'
          ) THEN
              ALTER TABLE public.chat_messages ADD COLUMN session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE;
          END IF;
      END
      $$;
    `)
    console.log("Migration successful")
  } catch (err) {
    console.error("Migration failed:", err)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
