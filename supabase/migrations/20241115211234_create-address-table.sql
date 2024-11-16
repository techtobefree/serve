CREATE TABLE public.address (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Link from gis.project_day
ALTER TABLE gis.project_day
ADD COLUMN address_id uuid REFERENCES public.address(id);

-- Enable RLS
ALTER TABLE public.address ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "read_address" ON public.address
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "insert_address" ON public.address
  FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) = (
      SELECT owner_id
      FROM project
      WHERE project.id = project_day_commitment.project_id
      LIMIT 1
    )
  );

CREATE POLICY "update_address" ON public.address
  FOR UPDATE TO authenticated
  USING (
    (select auth.uid()) = (
      SELECT owner_id
      FROM project
      WHERE project.id = project_day_item_ask.project_id
      LIMIT 1
    )
  );

CREATE POLICY "delete_address" ON public.address
  FOR DELETE TO authenticated
  USING (
    (select auth.uid()) = (
      SELECT owner_id
      FROM project
      WHERE project.id = project_day_item_ask.project_id
      LIMIT 1
    )
  );

-- Trigger to update the updated_at column
CREATE TRIGGER update_address_modtime
  BEFORE UPDATE ON public.address
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();
