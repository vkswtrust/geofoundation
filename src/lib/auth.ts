import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export interface AppProfile {
  id: string;
  member_code: string | null;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface AuthState {
  loading: boolean;
  user: User | null;
  profile: AppProfile | null;
  isAdmin: boolean;
}

async function loadRole(userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return Boolean(data);
}

async function loadProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id, member_code, email, full_name, avatar_url, created_at, last_login_at")
    .eq("id", userId)
    .maybeSingle();
  return (data as AppProfile | null) ?? null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    profile: null,
    isAdmin: false,
  });

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user ?? null;
      if (!user) {
        if (active) setState({ loading: false, user: null, profile: null, isAdmin: false });
        return;
      }
      const [isAdmin, profile] = await Promise.all([loadRole(user.id), loadProfile(user.id)]);
      if (active) setState({ loading: false, user, profile, isAdmin });
    };

    void hydrate();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void hydrate();
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function recordLogin(userId: string) {
  await supabase.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", userId);
}

export function displayName(profile: AppProfile | null, user: User | null) {
  return profile?.full_name || profile?.email || user?.email || "Member";
}
