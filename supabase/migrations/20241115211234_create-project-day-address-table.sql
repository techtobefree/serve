CREATE TABLE public.project_day_address (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  project_day_id uuid NOT NULL,
  name text,
  street_address text,
  city text,
  state text,
  postal_code text,
  country text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.project_day_address ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "read_address" ON public.project_day_address
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "insert_address" ON public.project_day_address
  FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) = project_day_address.created_by
  );

CREATE POLICY "update_address" ON public.project_day_address
  FOR UPDATE TO authenticated
  USING (
    (select auth.uid()) = project_day_address.created_by
  );

CREATE POLICY "delete_address" ON public.project_day_address
  FOR DELETE TO authenticated
  USING (
    (select auth.uid()) = project_day_address.created_by
  );

-- Trigger to update the updated_at column
CREATE TRIGGER update_address_modtime
  BEFORE UPDATE ON public.project_day_address
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();

ALTER TABLE public.project_day_address
ADD CONSTRAINT fk_project_id_to_project_id
FOREIGN KEY (project_id) REFERENCES project(id);

ALTER TABLE public.project_day_address
ADD CONSTRAINT fk_project_day_id_to_project_day_address_project_id
FOREIGN KEY (project_day_id) REFERENCES gis.project_day(id);
