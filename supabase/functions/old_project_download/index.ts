import { serverSupabase } from "../_shared/serverSupabase.ts"

Deno.serve(async (req) => {
  try {

    const { projectEventId } = await req.json()
    if (!projectEventId) {
      throw new Error('Missing projectEventId')
    }
    /*
    const { data: userData } = await serverSupabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      throw new Error('Missing user information')
    }

    // Verify user is an admin of the project
    const { data: projectEvent, error: projectEventError } = await serverSupabase
      .from('project_event') // Replace with your table name
      .select(`
        *,
        project (
          *
        )
      `)
      .eq('id', projectEventId)
      .single()

    if (projectEventError) {
      throw projectEventError
    }

    if (projectEvent.project?.owner_id !== user.id) {
      throw new Error('User is not an admin of the project')
    }
*/
    // Retrieve data
    const { data, error } = await serverSupabase
      .from('project_event_commitment') // Replace with your table name
      .select(`
        commitment_start,
        commitment_end,
        role,
        profile (
          user_id,
          handle,
          sensitive_profile (
            first_name,
            last_name,
            email
          )
        )
        `)
      .eq('project_event_id', projectEventId)

    if (error) {
      throw error
    }
    return new Response(
      JSON.stringify({ data }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { "Content-Type": "application/json" }, status: 400 },
    )
  }
})

/* To invoke locally:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/projectCommitmentsReport' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"projectEventId":"51366b06-a1c5-471d-80a0-c338eecf5825"}'

*/
