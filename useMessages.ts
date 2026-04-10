import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const useConversations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all messages involving the user
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!messages?.length) return [];

      // Group by conversation partner
      const convMap = new Map<string, typeof messages>();
      for (const msg of messages) {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!partnerId) continue;
        if (!convMap.has(partnerId)) convMap.set(partnerId, []);
        convMap.get(partnerId)!.push(msg);
      }

      // Get profiles for partners
      const partnerIds = [...convMap.keys()];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", partnerIds);

      return partnerIds.map((partnerId) => {
        const msgs = convMap.get(partnerId)!;
        const profile = profiles?.find((p) => p.id === partnerId);
        const lastMsg = msgs[0];
        const unread = msgs.filter(
          (m) => m.receiver_id === user.id && !m.lida
        ).length;

        return {
          partnerId,
          profile,
          lastMessage: lastMsg?.message ?? "",
          unread,
        };
      });
    },
    enabled: !!user,
  });
};

export const useChatMessages = (partnerId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !partnerId) return;

    const channel = supabase
      .channel(`chat-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as any;
          if (
            (msg.sender_id === user.id && msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === user.id)
          ) {
            queryClient.invalidateQueries({ queryKey: ["chat", partnerId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerId, queryClient]);

  return useQuery({
    queryKey: ["chat", partnerId],
    queryFn: async () => {
      if (!user || !partnerId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!partnerId,
  });
};

export const useSendMessage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiverId, message }: { receiverId: string; message: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("messages")
        .insert({ sender_id: user.id, receiver_id: receiverId, message });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat", variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
