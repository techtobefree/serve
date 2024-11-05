-- Seed data for the team table
INSERT INTO public.team (id, admin_id, name, description, unlisted, created_by)
VALUES 
  ('00000000-0000-0000-0000-00000d34d001', '00000000-0000-0000-0000-00000c53c001', 'Demo Team 1', 'A sample team', false, '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-00000d34d002', '00000000-0000-0000-0000-00000c53c001', 'Demo Team 2', 'Another sample team', false, '00000000-0000-0000-0000-00000c53c001')
ON CONFLICT (id) 
DO UPDATE SET 
  admin_id = EXCLUDED.admin_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  unlisted = EXCLUDED.unlisted,
  created_by = EXCLUDED.created_by;
