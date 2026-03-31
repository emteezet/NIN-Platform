-- RUN THIS IN YOUR SUPABASE SQL EDITOR --

-- Add status column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';

-- Add suspension_reason column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- Update RLS or add indices if needed (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Note: Ensure that the 'auth.users' trigger that creates profiles 
-- (if you have one) also sets the default status to 'ACTIVE'.
-- Usually, the 'DEFAULT' in ALTER TABLE covers existing and new rows.
