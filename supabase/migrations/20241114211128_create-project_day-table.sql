-- Create the project project_day table with RLS
CREATE TABLE gis.project_day (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,

  -- Column for the date (without time)
  project_day_date date NOT NULL,

  timezone TEXT NOT NULL,

  -- Column for location using PostGIS geography type (e.g., for storing latitude and longitude)
  location gis.GEOGRAPHY(Point, 4326),

  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- USE PostGIS index
create index project_day_geo_index
  on gis.project_day
  using GIST (location);

-- Enable Row Level Security
ALTER TABLE gis.project_day ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the user table
CREATE POLICY "read_project_day" ON gis.project_day
  FOR SELECT TO authenticated, anon
  USING (
    true
    -- TODO: should only allow self, and admin of project (and friends of user) to see
    -- auth.jwt() ->> 'user_id' = user_id::text
  );

-- Create a policy that allows users to manage the project_days of the project they admin
CREATE POLICY "insert_admin_project_day" ON gis.project_day
  FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) = (
      SELECT admin_id
      FROM project
      WHERE project.id = project_day.project_id
      LIMIT 1
    )
  );

CREATE POLICY "delete_admin_project_day" ON gis.project_day
  FOR DELETE TO authenticated
  USING (
    (select auth.uid()) = (
      SELECT admin_id
      FROM project
      WHERE project.id = project_day.project_id
      LIMIT 1
    )
  );

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_project_day_modtime
  BEFORE UPDATE ON gis.project_day
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();

ALTER TABLE gis.project_day
ADD CONSTRAINT fk_project_id_to_project_day_project_id
FOREIGN KEY (project_id) REFERENCES public.project(id);
