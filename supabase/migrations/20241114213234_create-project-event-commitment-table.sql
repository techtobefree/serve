-- Create the project project_event_commitment table with RLS
CREATE TABLE public.project_event_commitment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  project_event_id uuid NOT NULL,

  commitment_start timestamp with time zone NOT NULL,
  commitment_end timestamp with time zone NOT NULL,
  role text NOT NULL,

  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.project_event_commitment ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the user table
CREATE POLICY "read_project_event_commitment" ON public.project_event_commitment
  FOR SELECT TO authenticated, anon
  USING (
    true
    -- TODO: should only allow self, and admin of project (and friends of user) to see
    -- auth.jwt() ->> 'user_id' = user_id::text
  );

-- Create a policy that allows users to manage the project_event_commitments of the project they admin
CREATE POLICY "insert_project_event_commitment" ON public.project_event_commitment
  FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) = created_by
  );

CREATE POLICY "delete_project_event_commitment" ON public.project_event_commitment
  FOR DELETE TO authenticated
  USING (
    (select auth.uid()) = created_by
  );

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_project_event_commitment_modtime
  BEFORE UPDATE ON public.project_event_commitment
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();

ALTER TABLE public.project_event_commitment
ADD CONSTRAINT fk_project_id_to_project_id
FOREIGN KEY (project_id) REFERENCES project(id);

ALTER TABLE public.project_event_commitment
ADD CONSTRAINT fk_project_event_id_to_project_event_commitment_project_id
FOREIGN KEY (project_event_id) REFERENCES public.project_event(id);
