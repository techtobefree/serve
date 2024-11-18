import { supabase } from "../domains/db/supabaseClient";

export async function newProjectDay(
  projectId: string,
  userId: string,
  date: string,
  timezone: string,
  location: { lat: number, lng: number },
) {

  const { error } = await supabase
    .schema('gis')
    .from('project_day')
    .insert({
      project_id: projectId,
      project_day_date: date,
      created_by: userId,
      timezone,
      location: `POINT(${location.lng.toString()} ${location.lat.toString()})`,
    });
  if (error) {
    alert('Failed to create project day');
  }
}
