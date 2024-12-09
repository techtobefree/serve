import { useQuery } from "@tanstack/react-query";

import { setCurrentUser } from "../domains/currentUser/currentUserStore";
import { supabase } from "../domains/db/supabaseClient";

import { queryClient } from "./queryClient";

export async function changeHandle(userId: string, handle?: string | null) {
  if (handle === null || handle === undefined) {
    return
  }

  await supabase
    .from('profile')
    .update(
      {
        user_id: userId,
        handle: handle,
      }
    ).eq('user_id', userId);

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

export async function changeEmail(userId: string, email?: string | null) {
  if (email === null || email === undefined) {
    return
  }

  await supabase
    .from('sensitive_profile')
    .update(
      {
        user_id: userId,
        email: email,
      }
    ).eq('user_id', userId);

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

type ChangeableProfile = {
  firstName?: string | null,
  lastName?: string | null,
}
type ChangeableProfileDB = {
  first_name?: string,
  last_name?: string,
}

export async function changeName(userId: string,
  { firstName, lastName }: ChangeableProfile) {
  const toChange: ChangeableProfileDB = {}

  if (firstName !== undefined && firstName !== null) {
    toChange.first_name = firstName
  }
  if (lastName !== undefined && lastName !== null) {
    toChange.last_name = lastName
  }

  if (Object.keys(toChange).length === 0) {
    throw new Error('No changes to make')
  }

  await supabase
    .from('sensitive_profile')
    .update(
      {
        user_id: userId,
        ...toChange
      }
    ).eq('user_id', userId);

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

export async function acceptTerms(userId: string, acceptedTerms: boolean) {
  await supabase
    .from('sensitive_profile')
    .update(
      {
        user_id: userId,
        accepted_terms: acceptedTerms
      }
    ).eq('user_id', userId);

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

async function fetchUserProfile(userId: string) {
  return supabase
    .from('profile')
    .select(`
      *,
      sensitive_profile (
        *
      )
    `)
    .eq('user_id', userId)
    .single();
}


async function createProfile(userId: string) {
  await supabase
    .from('profile')
    .insert([
      {
        user_id: userId,
        handle: '',
        created_by: userId
      }
    ]);

  await supabase
    .from('sensitive_profile')
    .insert([
      {
        user_id: userId,
        created_by: userId
      }
    ]);

  const { data, error } = await fetchUserProfile(userId);

  if (error) {
    throw new Error(error.message);
  }

  return data
}

export function useProfileQuery(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return
      }

      const { data } = await fetchUserProfile(userId);

      if (!data) {
        return createProfile(userId)
      }

      if (data.sensitive_profile.length === 0) {
        await supabase
          .from('sensitive_profile')
          .insert([
            {
              user_id: userId,
              created_by: userId
            }
          ]);

        const { data, error } = await fetchUserProfile(userId)

        if (error) {
          throw new Error(error.message);
        }

        return data
      }

      setCurrentUser({
        userId: data.user_id,
        email: data.sensitive_profile[0]?.email || undefined,
        handle: data.handle,
        firstName: data.sensitive_profile[0]?.first_name || undefined,
        lastName: data.sensitive_profile[0]?.last_name || undefined,
        acceptedTerms: data.sensitive_profile[0]?.accepted_terms || false,
      })

      return data;
    }
  })
}
