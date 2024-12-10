import { useQuery } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";

async function fetchUserProfile(userId: string) {
  return supabase
    .from('profile')
    .select(`
      *
    `)
    .eq('user_id', userId)
    .single();
}

export function useBasicProfileQuery(userId?: string) {
  return useQuery({
    queryKey: ['basic-profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return
      }

      const { data, error } = await fetchUserProfile(userId);

      if (error) {
        throw new Error(error.message);
      }

      return data

    }
  })
}
