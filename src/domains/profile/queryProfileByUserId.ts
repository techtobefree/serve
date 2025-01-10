import { useQuery } from "@tanstack/react-query";

import { clientSupabase } from "../persistence/clientSupabase";
import { queryClient } from "../persistence/queryClient";
import { showToast } from "../ui/toast";

export async function changeHandle(userId: string, handle?: string | null) {
  if (handle === null || handle === undefined) {
    return
  }

  const { error } = await clientSupabase
    .from('profile')
    .update(
      {
        user_id: userId,
        handle,
      }
    ).eq('user_id', userId);

  if (error) {
    showToast('Failed to update bio', { isError: true, duration: 5000 })
    throw new Error(error.message);
  }

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

export async function changeBio(userId: string, bio?: string | null) {
  if (bio === null || bio === undefined) {
    return
  }

  const { error } = await clientSupabase
    .from('profile')
    .update(
      {
        user_id: userId,
        bio,
      }
    ).eq('user_id', userId);

  if (error) {
    showToast('Failed to update bio', { isError: true, duration: 5000 })
    throw new Error(error.message);
  }

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

export async function changeEmail(userId: string, email?: string | null) {
  if (email === null || email === undefined) {
    return
  }

  const { error } = await clientSupabase
    .from('sensitive_profile')
    .update(
      {
        user_id: userId,
        email: email,
      }
    ).eq('user_id', userId);

  if (error) {
    showToast('Failed to change email', { isError: true, duration: 5000 })
    throw new Error(error.message);
  }

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

export async function changePhone(userId: string, phone?: string | null) {
  if (phone === null || phone === undefined) {
    return
  }

  const { error } = await clientSupabase
    .from('sensitive_profile')
    .update(
      {
        user_id: userId,
        phone: phone,
      }
    ).eq('user_id', userId);

  if (error) {
    showToast('Failed to change phone', { isError: true, duration: 5000 })
    throw new Error(error.message);
  }

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

  const { error } = await clientSupabase
    .from('sensitive_profile')
    .update(
      {
        user_id: userId,
        ...toChange
      }
    ).eq('user_id', userId);

  if (error) {
    showToast('Failed to change name', { isError: true, duration: 5000 })
    throw new Error(error.message);
  }

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

export async function acceptTerms(userId: string) {
  const { error } = await clientSupabase
    .from('sensitive_profile')
    .update(
      {
        user_id: userId,
        accepted_at: new Date().toISOString(),
      }
    ).eq('user_id', userId);

  if (error) {
    showToast('Failed to update terms', { isError: true, duration: 5000 })
    throw new Error(error.message);
  }

  await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
}

async function fetchUserProfile(userId: string) {
  return clientSupabase
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
  await clientSupabase
    .from('profile')
    .insert([
      {
        user_id: userId,
        handle: '',
        created_by: userId
      }
    ]);

  await clientSupabase
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
        await clientSupabase
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

      return data;
    }
  })
}
