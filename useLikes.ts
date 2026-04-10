import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useSendLike = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (likedUserId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Insert like
      const { error: likeError } = await supabase
        .from("likes")
        .insert({ user_id: user.id, liked_user_id: likedUserId });
      if (likeError) throw likeError;

      // Check if mutual like exists (the other user liked us too)
      const { data: mutualLike } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", likedUserId)
        .eq("liked_user_id", user.id)
        .maybeSingle();

      if (mutualLike) {
        // Create match!
        const { error: matchError } = await supabase
          .from("matches")
          .insert({ user1_id: user.id, user2_id: likedUserId });
        if (matchError) throw matchError;
        return { matched: true };
      }

      return { matched: false };
    },
    onSuccess: (result) => {
      if (result.matched) {
        toast({
          title: "✨ É uma conexão!",
          description: "Deus preparou esse encontro. Iniciem uma conversa com fé!",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["discover-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
};
