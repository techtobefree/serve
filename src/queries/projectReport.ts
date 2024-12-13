import { userStore } from "../domains/auth/sessionStore";
import { clientSupabase } from "../domains/db/clientSupabase";
import { showToast } from "../domains/ui/toast";

export async function projectCommitmentReport({ projectEventId }: { projectEventId: string }) {
  const accessToken = userStore.session?.access_token;
  const { data, error } = await clientSupabase.functions.invoke('project-report-download', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      projectEventId
    },
  });

  if (error) {
    console.error('Error invoking function:', error.message);
    showToast('Failed to download report', { duration: 5000, isError: true });
    throw error;
  }

  return data.map((item: any) => {
    return {
      commitment_start: item.commitment_start,
      commitment_end: item.commitment_end,
      role: item.role,
      // profile: {
      user_id: item.profile.user_id,
      handle: item.profile.handle,
      // sensitive_profile: {
      first_name: item.profile.sensitive_profile.first_name,
      last_name: item.profile.sensitive_profile.last_name,
      email: item.profile.sensitive_profile.email,
    }
  })
}
