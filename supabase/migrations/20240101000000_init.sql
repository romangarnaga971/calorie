-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    age INTEGER,
    sex TEXT CHECK (sex IN ('male', 'female')),
    weight_kg NUMERIC(5, 2),
    height_cm INTEGER,
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'high')),
    goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
    goal_pace TEXT CHECK (goal_pace IN ('slow', 'standard', 'fast')),
    restrictions_text TEXT,
    daily_calories INTEGER,
    daily_protein_g INTEGER,
    daily_fat_g INTEGER,
    daily_carbs_g INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Weight Logs Table
CREATE TABLE IF NOT EXISTS public.weight_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5, 2) NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Food Entries Table
CREATE TABLE IF NOT EXISTS public.food_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('dish', 'label', 'manual')),
    name TEXT NOT NULL,
    photo_url TEXT,
    weight_g NUMERIC(6, 2),
    calories INTEGER NOT NULL,
    protein_g NUMERIC(5, 1) NOT NULL,
    fat_g NUMERIC(5, 1) NOT NULL,
    carbs_g NUMERIC(5, 1) NOT NULL,
    ai_confidence NUMERIC(4, 2),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Norm Adjustment Suggestions Table
CREATE TABLE IF NOT EXISTS public.norm_adjustment_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    suggested_calories INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.norm_adjustment_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies for Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for Weight Logs
CREATE POLICY "Users can view own weight logs" ON public.weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight logs" ON public.weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own weight logs" ON public.weight_logs FOR DELETE USING (auth.uid() = user_id);

-- Create policies for Food Entries
CREATE POLICY "Users can view own food entries" ON public.food_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own food entries" ON public.food_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food entries" ON public.food_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food entries" ON public.food_entries FOR DELETE USING (auth.uid() = user_id);

-- Create policies for Chat Messages
CREATE POLICY "Users can view own chat messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for Norm Suggestions
CREATE POLICY "Users can view own norm suggestions" ON public.norm_adjustment_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own norm suggestions" ON public.norm_adjustment_suggestions FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically update 'updated_at' on profiles
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
