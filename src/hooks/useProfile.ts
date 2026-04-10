import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: TablesUpdate<"profiles">) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
};

export const useDiscoverProfiles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["discover-profiles", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get blocked user IDs
      const { data: blocked } = await supabase
        .from("blocked_users")
        .select("blocked_user_id")
        .eq("user_id", user.id);
      const blockedIds = (blocked ?? []).map((b) => b.blocked_user_id).filter(Boolean) as string[];

      // Get already liked user IDs
      const { data: liked } = await supabase
        .from("likes")
        .select("liked_user_id")
        .eq("user_id", user.id);
      const likedIds = (liked ?? []).map((l) => l.liked_user_id).filter(Boolean) as string[];

      const excludeIds = [...new Set([...blockedIds, ...likedIds, user.id])];

      let query = supabase
        .from("profiles")
        .select("*")
        .eq("ativo", true)
        .limit(20);

      // Supabase doesn't support NOT IN directly, use .not with filter
      if (excludeIds.length > 0) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
};
