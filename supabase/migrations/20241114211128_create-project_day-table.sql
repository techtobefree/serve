-- Create the project project_day table with RLS
CREATE TABLE public.project_day (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,

  -- Column for the date (without time)
  project_day_date date NOT NULL,

  timezone TEXT NOT NULL,

  -- Column for location using PostGIS geography type (e.g., for storing latitude and longitude)
  location geography(Point, 4326),

  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- USE PostGIS index
create index project_day_geo_index
  on public.project_day
  using GIST (location);

-- Enable Row Level Security
ALTER TABLE public.project_day ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the user table
CREATE POLICY "read_project_day" ON public.project_day
  FOR SELECT TO authenticated, anon
  USING (
    true
    -- TODO: should only allow self, and admin of project (and friends of user) to see
    -- auth.jwt() ->> 'user_id' = user_id::text
  );

-- Create a policy that allows users to manage the project_days of the project they admin
CREATE POLICY "insert_admin_project_day" ON public.project_day
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = (
      SELECT auth_id 
      FROM project 
      WHERE project.id = project_day.project_id
    )
  );

CREATE POLICY "delete_admin_project_day" ON public.project_day
  FOR DELETE TO authenticated
  USING (
    auth.uid() = (
      SELECT auth_id 
      FROM project 
      WHERE project.id = project_day.project_id
    )
  );

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_project_day_modtime
  BEFORE UPDATE ON public.project_day
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();

ALTER TABLE project_day
ADD CONSTRAINT fk_project_id_to_project_day_project_id
FOREIGN KEY (project_id) REFERENCES project(id);
