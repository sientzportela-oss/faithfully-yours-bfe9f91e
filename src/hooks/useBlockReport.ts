import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useBlockUser = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (blockedUserId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("blocked_users").insert({
        user_id: user.id,
        blocked_user_id: blockedUserId,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Usuário bloqueado", description: "Essa pessoa não poderá mais interagir com você." });
      queryClient.invalidateQueries({ queryKey: ["discover-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useReportUser = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ reportedId, reason, description }: { reportedId: string; reason: string; description?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("reports").insert({
        reported_id: user.id,
        reported_user_id: reportedId,
        user_id: user.id,
        reason,
        description,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Denúncia enviada", description: "Nossa equipe analisará o caso. Obrigado por manter a comunidade segura. 🙏" });
    },
  });
};
