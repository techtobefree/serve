import { useMutation } from "@tanstack/react-query";

import { Address } from "../domains/address/addressComponents";
import { supabase } from "../domains/db/supabaseClient";
import { showToast } from "../domains/ui/toast";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { queryClient } from "../queries/queryClient";

async function createEvent({
  projectId,
  userId,
  date,
  timezone,
  location,
  addressName,
  address,
}: {
  projectId: string,
  userId: string,
  date: string,
  timezone: string,
  location: { lat: number, lng: number },
  addressName: string,
  address: Address,
}) {
  const { error } = await supabase
    .from('project_event')
    .insert({
      project_event_date: date,
      project_id: projectId,
      created_by: userId,
      timezone,
      location: `POINT(${location.lng.toString()} ${location.lat.toString()})`,
      location_name: addressName,
      street_address: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
    })
    .select('id')
    .single();

  if (error) {
    showToast('Failed to create project event', { duration: 5000, isError: true });
    throw error;
  }
}

export default function useCreateEvent(
  { projectId }: { projectId: string },
  callback: (err?: Error) => void) {
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      void queryClient.invalidateQueries({ queryKey: [projectByIdKey, projectId] });
      callback();
    },
    onError: (error: Error) => {
      console.error('Error creating event:', error);
      callback(error);
    },
  });
}
