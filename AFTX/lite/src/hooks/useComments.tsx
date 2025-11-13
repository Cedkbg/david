import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useComments = (videoId: string) => {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .eq("video_id", videoId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });
};

export const useReplies = (commentId: string) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .eq("parent_comment_id", commentId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as any[];
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      userId,
      text,
      parentCommentId,
    }: {
      videoId: string;
      userId: string;
      text: string;
      parentCommentId?: string;
    }) => {
      const { error } = await supabase.from("comments").insert({
        video_id: videoId,
        user_id: userId,
        text,
        parent_comment_id: parentCommentId,
      });

      if (error) throw error;

      // Increment comments count
      const { data: video } = await supabase
        .from("videos")
        .select("comments_count")
        .eq("id", videoId)
        .single();

      if (video) {
        await supabase
          .from("videos")
          .update({ comments_count: video.comments_count + 1 })
          .eq("id", videoId);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      if (variables.parentCommentId) {
        queryClient.invalidateQueries({ queryKey: ["replies", variables.parentCommentId] });
      }
      toast.success("Commentaire ajouté");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'ajout du commentaire");
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, videoId }: { commentId: string; videoId: string }) => {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);

      if (error) throw error;

      // Decrement comments count
      const { data: video } = await supabase
        .from("videos")
        .select("comments_count")
        .eq("id", videoId)
        .single();

      if (video) {
        await supabase
          .from("videos")
          .update({ comments_count: Math.max(0, video.comments_count - 1) })
          .eq("id", videoId);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Commentaire supprimé");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });
};
