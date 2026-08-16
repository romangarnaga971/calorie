-- Add daily_water_ml to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_water_ml integer DEFAULT 2000;

-- Create water_logs table
CREATE TABLE IF NOT EXISTS public.water_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount_ml integer NOT NULL,
    logged_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for water_logs
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own water logs"
    ON public.water_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own water logs"
    ON public.water_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water logs"
    ON public.water_logs FOR DELETE
    USING (auth.uid() = user_id);
