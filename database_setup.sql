-- RUN THIS IN YOUR SUPABASE SQL EDITOR --

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the verification_history table
CREATE TABLE IF NOT EXISTS public.verification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'NIN_VERIFY', 'BVN_VERIFY', etc.
    identifier TEXT NOT NULL, -- Encrypted NIN/BVN
    id_data TEXT NOT NULL, -- FULL Encrypted identity data (JSON string)
    slip_type TEXT, -- 'regular', 'premium', 'improved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security)
ALTER TABLE public.verification_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own history
CREATE POLICY "Users can view their own verification history" 
ON public.verification_history FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own history (though this usually happens via service role)
CREATE POLICY "Users can insert their own verification history" 
ON public.verification_history FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy: Service role has full access
CREATE POLICY "Service role has full access" 
ON public.verification_history FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_verification_history_user_id ON public.verification_history(user_id);
