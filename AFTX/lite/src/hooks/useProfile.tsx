import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: {
        display_name?: string;
        bio?: string;
        avatar_url?: string;
        external_link?: string;
      };
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil mis à jour !");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useCheckFollow = (followerId: string | undefined, followingId: string | undefined) => {
  return useQuery({
    queryKey: ["follow", followerId, followingId],
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

export const useFollowStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["follow-stats", userId],
    queryFn: async () => {
      if (!userId) return { followers: 0, following: 0 };

      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);

      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);

      return {
        followers: followersCount || 0,
        following: followingCount || 0,
      };
    },
    enabled: !!userId,
  });
};
