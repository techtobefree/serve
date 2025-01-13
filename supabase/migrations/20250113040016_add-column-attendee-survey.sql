alter table public.project
  add column attendee_survey_id uuid;

ALTER TABLE public.project
ADD CONSTRAINT fk_attendee_survey_id_to_survey_id
FOREIGN KEY (attendee_survey_id) REFERENCES public.survey(id);
