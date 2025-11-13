-- Create interests table for content categories
CREATE TABLE public.interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_interests junction table
CREATE TABLE public.user_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, interest_id)
);

-- Enable RLS
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- Interests are viewable by everyone
CREATE POLICY "Interests are viewable by everyone"
ON public.interests
FOR SELECT
USING (true);

-- Users can view all user interests
CREATE POLICY "User interests are viewable by everyone"
ON public.user_interests
FOR SELECT
USING (true);

-- Users can manage their own interests
CREATE POLICY "Users can insert own interests"
ON public.user_interests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interests"
ON public.user_interests
FOR DELETE
USING (auth.uid() = user_id);

-- Add category field to videos table
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS category TEXT;

-- Insert default interests
INSERT INTO public.interests (name, icon) VALUES
  ('Sport', '⚽'),
  ('Musique', '🎵'),
  ('Cuisine', '🍳'),
  ('Voyage', '✈️'),
  ('Mode', '👗'),
  ('Gaming', '🎮'),
  ('Art', '🎨'),
  ('Tech', '💻'),
  ('Danse', '💃'),
  ('Comédie', '😂'),
  ('Éducation', '📚'),
  ('Fitness', '💪')
ON CONFLICT (name) DO NOTHING;