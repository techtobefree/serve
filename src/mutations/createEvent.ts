import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { Address } from "../domains/map/addressComponents";
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
    .single();;

  if (error) {
    alert('Failed to create project event');
    return;
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
      console.error('Error creating post:', error);
      callback(error);
    },
  });
}
