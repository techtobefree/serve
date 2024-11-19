import { useMutation } from "@tanstack/react-query";

import { supabase } from "../domains/db/supabaseClient";
import { Address } from "../domains/map/addressComponents";
import { partialQueryKey as projectByIdKey } from "../queries/projectById";
import { partialQueryKey as projectDaysKey } from "../queries/projectDaysByProjectId";
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
  const { data: addressData, error } = await supabase
    .schema('gis')
    .from('project_day')
    .insert({
      project_id: projectId,
      project_day_date: date,
      created_by: userId,
      timezone,
      location: `POINT(${location.lng.toString()} ${location.lat.toString()})`,
    })
    .select('id')
    .single();;

  if (error) {
    alert('Failed to create project day');
    return;
  }

  const { error: addressError } = await supabase
    .from('project_day_address')
    .insert({
      project_id: projectId,
      project_day_id: addressData.id,
      name: addressName,
      street_address: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
      created_by: userId,
      updated_by: userId,
    })

  if (addressError) {
    alert('Failed to create address');
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
      void queryClient.invalidateQueries({ queryKey: [projectDaysKey, projectId] });
      callback();
    },
    onError: (error: Error) => {
      console.error('Error creating post:', error);
      callback(error);
    },
  });
}
