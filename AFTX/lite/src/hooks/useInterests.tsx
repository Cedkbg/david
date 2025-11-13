import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useInterests = () => {
  return useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interests")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};

export const useUserInterests = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-interests", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_interests")
        .select(`
          *,
          interests (
            id,
            name,
            icon
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useSaveUserInterests = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, interestIds }: { userId: string; interestIds: string[] }) => {
      // Delete existing interests
      await supabase.from("user_interests").delete().eq("user_id", userId);

      // Insert new interests
      if (interestIds.length > 0) {
        const { error } = await supabase
          .from("user_interests")
          .insert(interestIds.map((interestId) => ({ user_id: userId, interest_id: interestId })));

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-interests"] });
      toast.success("Centres d'intérêt sauvegardés");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    },
  });
};
