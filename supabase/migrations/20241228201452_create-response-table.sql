-- Create the survey_response table with RLS
CREATE TABLE public.survey_response (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  survey_id uuid NOT NULL,
  survey_question_id uuid NOT NULL,
  question_type text NOT NULL,
  response_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.survey_response ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the user table
CREATE POLICY "read_survey_response" ON public.survey_response
  FOR SELECT TO authenticated, anon
  USING (
    (select auth.uid()) = user_id or (
      SELECT owner_id
      FROM project
      WHERE project.id = project_id
      LIMIT 1
    )
  );

-- Create a policy that allows users manage their own data
CREATE POLICY "insert_survey_response" ON public.survey_response
  FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
  );

CREATE POLICY "delete_survey_response" ON public.survey_response
  FOR DELETE TO authenticated
  USING (
    (select auth.uid()) = user_id
  );

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_survey_response_modtime
  BEFORE UPDATE ON public.survey_response
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();

ALTER TABLE public.survey_response
ADD CONSTRAINT fk_project_id_to_project_id
FOREIGN KEY (project_id) REFERENCES public.project(id);

ALTER TABLE public.survey_response
ADD CONSTRAINT fk_survey_id_to_survey_id
FOREIGN KEY (survey_id) REFERENCES public.survey(id);

ALTER TABLE public.survey_response
ADD CONSTRAINT fk_survey_question_id_to_survey_question_id
FOREIGN KEY (survey_question_id) REFERENCES public.survey_question(id);
