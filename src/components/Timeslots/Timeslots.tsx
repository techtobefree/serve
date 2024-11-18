import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import { useForm } from '@tanstack/react-form';

import { supabase } from '../../domains/db/supabaseClient';
import { TableInsert } from '../../domains/db/tables';
import { mayReplace } from '../../domains/ui/navigation';
import { useNavigate } from '../../router';

type Props = {
  timeslot: TableInsert['project_day_timeslot']
}

const TimeslotForm = ({ timeslot }: Props) => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      project_id: timeslot.project_id,
      project_day_id: timeslot.project_day_id,
      role: timeslot.role || 'volunteer',
      timeslot_count: timeslot.timeslot_count,
      timeslot_start_hour: timeslot.timeslot_start_hour || 8,
      timeslot_start_minute: timeslot.timeslot_start_minute || 0,
      timeslot_duration_minutes: timeslot.timeslot_duration_minutes || 60,
    },
    onSubmit: async ({ value }) => {
      if (!value.timeslot_start_hour ||
        !value.timeslot_start_minute ||
        !value.timeslot_duration_minutes
      ) {
        alert('Start hour, start minute, and duration are required');
        return;
      }

      let res;
      if (timeslot.id) {
        res = await supabase
          .from('project_day_timeslot')
          .update({ ...value })
          .eq('id', timeslot.id)
          .select('id')
          .single();
      } else {
        res = await supabase
          .from('project_day_timeslot')
          .insert({ created_by: timeslot.created_by, ...value })
          .select('id')
          .single();
      }

      if (res.error) {
        console.error(res.error);
        alert('Failed to save timeslot');
      } else {
        navigate(
          '/timeslot/:timeslotId/view',
          { params: { timeslotId: res.data.id }, replace: mayReplace() }
        )
      }
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      void form.handleSubmit()
    }}>
      <form.Field name='timeslot_start_hour'>
        {(field) => (
          <IonItem>
            <IonLabel>Start Hour</IonLabel>
            <IonInput
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
            />
          </IonItem>
        )}
      </form.Field>
      <form.Field name='timeslot_start_minute'>
        {(field) => (
          <IonItem>
            <IonLabel>Start Minute</IonLabel>
            <IonInput
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
            />
          </IonItem>
        )}
      </form.Field>
      <form.Field name='timeslot_duration_minutes'>
        {(field) => (
          <IonItem>
            <IonLabel>Duration</IonLabel>
            <IonInput
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
            />
          </IonItem>
        )}
      </form.Field>
      <IonButton type="submit" expand="block" color="primary">
        Save
      </IonButton>
    </form>
  );
};

export default TimeslotForm;
