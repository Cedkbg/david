-- Fix search_path for existing functions
DROP FUNCTION IF EXISTS public.increment_likes(UUID);
DROP FUNCTION IF EXISTS public.decrement_likes(UUID);

CREATE OR REPLACE FUNCTION public.increment_likes(video_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.videos
  SET likes_count = likes_count + 1
  WHERE id = video_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_likes(video_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.videos
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = video_id;
END;
$$;