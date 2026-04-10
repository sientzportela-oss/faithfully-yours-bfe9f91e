import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Ensures a profile row exists for the given user.
 * Uses upsert so it works whether the trigger created the row or not.
 */
export const ensureProfile = async (user: User) => {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email ?? "" },
      { onConflict: "id" }
    );
  if (error) {
    console.error("ensureProfile error:", error);
  }
};

/**
 * Checks profile completeness and returns the correct redirect path.
 */
export const getPostAuthDestination = async (userId: string): Promise<string> => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("nome")
    .eq("id", userId)
    .maybeSingle();

  return profile?.nome ? "/app" : "/onboarding";
};
