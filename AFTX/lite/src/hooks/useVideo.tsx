import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useVideos = () => {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          profiles!videos_user_id_fkey (
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .eq("visibility", "public")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });
};

export const useFollowingVideos = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["following-videos", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Get list of users being followed
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", userId);

      if (!follows || follows.length === 0) return [];

      const followingIds = follows.map((f) => f.following_id);

      // Get videos from followed users
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          profiles!videos_user_id_fkey (
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .in("user_id", followingIds)
        .eq("visibility", "public")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
  });
};

export const usePersonalizedVideos = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["personalized-videos", userId],
    queryFn: async () => {
      if (!userId) {
        // If not logged in, return all public videos
        const { data, error } = await supabase
          .from("videos")
          .select(`
            *,
            profiles!videos_user_id_fkey (
              username,
              display_name,
              avatar_url,
              is_verified
            )
          `)
          .eq("visibility", "public")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as any[];
      }

      // Get user interests
      const { data: userInterests } = await supabase
        .from("user_interests")
        .select("interest_id, interests(name)")
        .eq("user_id", userId);

      if (!userInterests || userInterests.length === 0) {
        // No interests set, return all videos
        const { data, error } = await supabase
          .from("videos")
          .select(`
            *,
            profiles!videos_user_id_fkey (
              username,
              display_name,
              avatar_url,
              is_verified
            )
          `)
          .eq("visibility", "public")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as any[];
      }

      const interestNames = userInterests.map((ui: any) => ui.interests.name);

      // Get videos matching user interests
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          profiles!videos_user_id_fkey (
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .in("category", interestNames)
        .eq("visibility", "public")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });
};

export const useUserVideos = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-videos", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useLikeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, userId }: { videoId: string; userId: string }) => {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("likes")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("video_id", videoId)
          .eq("user_id", userId);

        if (error) throw error;

        // Decrement likes count
        const { data: video } = await supabase
          .from("videos")
          .select("likes_count")
          .eq("id", videoId)
          .single();

        if (video) {
          await supabase
            .from("videos")
            .update({ likes_count: Math.max(0, video.likes_count - 1) })
            .eq("id", videoId);
        }

        return { action: "unliked" };
      } else {
        // Like
        const { error } = await supabase
          .from("likes")
          .insert({ video_id: videoId, user_id: userId });

        if (error) throw error;

        // Increment likes count
        const { data: video } = await supabase
          .from("videos")
          .select("likes_count")
          .eq("id", videoId)
          .single();

        if (video) {
          await supabase
            .from("videos")
            .update({ likes_count: video.likes_count + 1 })
            .eq("id", videoId);
        }

        return { action: "liked" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors du like");
    },
  });
};

export const useCheckLike = (videoId: string, userId: string | undefined) => {
  return useQuery({
    queryKey: ["like", videoId, userId],
    queryFn: async () => {
      if (!userId) return false;

      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", userId)
        .single();

      return !!data;
    },
    enabled: !!userId,
  });
};

export const useShareVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId }: { videoId: string }) => {
      // Increment shares count
      const { data: video } = await supabase
        .from("videos")
        .select("shares_count")
        .eq("id", videoId)
        .single();

      if (video) {
        await supabase
          .from("videos")
          .update({ shares_count: video.shares_count + 1 })
          .eq("id", videoId);
      }

      return { action: "shared" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Publication partagée");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors du partage");
    },
  });
};
