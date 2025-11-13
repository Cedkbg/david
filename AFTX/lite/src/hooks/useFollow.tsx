import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFollowStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["follow-stats", userId],
    queryFn: async () => {
      if (!userId) return { followers: 0, following: 0 };

      const [followersResult, followingResult] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact" }).eq("following_id", userId),
        supabase.from("follows").select("*", { count: "exact" }).eq("follower_id", userId),
      ]);

      return {
        followers: followersResult.count || 0,
        following: followingResult.count || 0,
      };
    },
    enabled: !!userId,
  });
};

export const useIsFollowing = (followerId: string | undefined, followingId: string | undefined) => {
  return useQuery({
    queryKey: ["is-following", followerId, followingId],
    queryFn: async () => {
      if (!followerId || !followingId) return false;

      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .single();

      return !!data;
    },
    enabled: !!followerId && !!followingId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
      // Check if already following
      const { data: existingFollow } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .single();

      if (existingFollow) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", followerId)
          .eq("following_id", followingId);

        if (error) throw error;
        return { action: "unfollowed" };
      } else {
        // Follow
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: followerId, following_id: followingId });

        if (error) throw error;
        return { action: "followed" };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["follow-stats"] });
      queryClient.invalidateQueries({ queryKey: ["is-following"] });
      toast.success(data.action === "followed" ? "Utilisateur suivi" : "Utilisateur non suivi");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors du suivi");
    },
  });
};
