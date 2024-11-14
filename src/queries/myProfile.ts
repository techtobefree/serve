import { randAnimal, randColor } from "@ngneat/falso";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";

import { queryClient } from "./queryClient";

export async function changeHandle(userId: string, handle: string) {
  await supabase
    .from('profile')
    .update(
      {
        user_id: userId,
        handle: handle,
      }
    ).eq('user_id', userId);

  queryClient.invalidateQueries({ queryKey: ['my-profile', userId] });
}

export function useMyProfileQuery(userId?: string) {
  return useQuery({
    queryKey: ['my-profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return
      }
      const { data } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        return data
      } else {
        await supabase
          .from('profile')
          .insert([
            {
              user_id: userId,
              handle: [randColor(), randAnimal()].join(' '),
              created_by: userId
            }
          ]);
      }
      console.log('try 2')
      const { data: try2, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return try2;
    }
  })
}
