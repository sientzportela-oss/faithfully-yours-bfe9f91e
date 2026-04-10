import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useMatches = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["matches", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("ativo", true)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) throw error;

      // Get the other user's profile for each match
      const matchedUserIds = (data ?? []).map((m) =>
        m.user1_id === user.id ? m.user2_id : m.user1_id
      ).filter(Boolean) as string[];

      if (matchedUserIds.length === 0) return [];

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", matchedUserIds);

      if (profileError) throw profileError;

      return (data ?? []).map((match) => {
        const otherId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const profile = profiles?.find((p) => p.id === otherId);
        return { ...match, profile };
      });
    },
    enabled: !!user,
  });
};
