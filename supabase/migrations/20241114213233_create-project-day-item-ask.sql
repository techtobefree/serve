-- Create the project project_day_item_ask table with RLS
CREATE TABLE public.project_day_item_ask (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  project_day_id uuid NOT NULL,

  every_member boolean NOT NULL,
  item_count int NOT NULL,
  item_name text NOT NULL,

  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.project_day_item_ask ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the user table
CREATE POLICY "read_project_day_item_ask" ON public.project_day_item_ask
  FOR SELECT TO authenticated, anon
  USING (
    true
    -- TODO: should only allow self, and admin of project (and friends of user) to see
    -- auth.jwt() ->> 'user_id' = user_id::text
  );

-- Create a policy that allows users to manage the project_day_item_asks of the project they admin
CREATE POLICY "insert_admin_project_day_item_ask" ON public.project_day_item_ask
  FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) = (
      SELECT owner_id
      FROM project
      WHERE project.id = project_day_item_ask.project_id
      LIMIT 1
    )
  );

CREATE POLICY "delete_admin_project_day_item_ask" ON public.project_day_item_ask
  FOR DELETE TO authenticated
  USING (
    (select auth.uid()) = (
      SELECT owner_id
      FROM project
      WHERE project.id = project_day_item_ask.project_id
      LIMIT 1
    )
  );

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_project_day_item_ask_modtime
  BEFORE UPDATE ON public.project_day_item_ask
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();

ALTER TABLE public.project_day_item_ask
ADD CONSTRAINT fk_project_id_to_project_id
FOREIGN KEY (project_id) REFERENCES project(id);

ALTER TABLE public.project_day_item_ask
ADD CONSTRAINT fk_project_day_id_to_project_day_item_ask_project_id
FOREIGN KEY (project_day_id) REFERENCES gis.project_day(id);
