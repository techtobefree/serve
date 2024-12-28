import { format } from "date-fns";
import { clientSupabase } from "../../persistence/clientSupabase";
import { showToast } from "../../ui/toast";

export async function projectCommitmentsReport({ projectEventId }: { projectEventId: string }) {
  const { data, error } = await clientSupabase.functions.invoke('projectCommitmentsReport', {
    method: 'POST',
    body: JSON.stringify({ projectEventId }),
  });

  if (error) {
    console.error('Error invoking function:', error.message);
    showToast('Failed to download report', { duration: 5000, isError: true });
    throw error;
  }

  const mapped = data.map((item: any) => {
    return {
      commitment_start: format(new Date(item.commitment_start), 'HH:mm'),
      commitment_end: format(new Date(item.commitment_end), 'HH:mm'),
      role: item.role,
      // profile: {
      handle: item.profile.handle,
      // sensitive_profile: {
      first_name: item.profile.sensitive_profile[0].first_name,
      last_name: item.profile.sensitive_profile[0].last_name,
      email: item.profile.sensitive_profile[0].email,
    }
  }) as Object[]

  return {
    data: mapped,
    metadata: {
      projectDate: format(new Date(data[0].commitment_start), 'yyyy.MM.dd'),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/\//g, ''),
    }
  }
}
