import { IonButton, IonCheckbox, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import { useForm } from '@tanstack/react-form';

import { supabase } from '../../domains/db/supabaseClient';
import { TableInsert } from '../../domains/db/tables';
import { mayReplace } from '../../domains/ui/navigation';
import { useNavigate } from '../../router';

type Props = {
  project: TableInsert['project']
}

const ProjectForm = ({ project }: Props) => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: project.name,
      published: project.published,
      description: project.description || '',
      image_url: project.image_url || '',
      owner_id: project.owner_id || '',
    },
    onSubmit: async ({ value }) => {
      if (!value.name || !value.owner_id) {
        alert('Name and Admin are required');
        return;
      }

      let res;
      if (project.id) {
        res = await supabase
          .from('project')
          .update({ ...value })
          .eq('id', project.id)
          .select('id')
          .single();
      } else {
        res = await supabase
          .from('project')
          .insert({ created_by: project.created_by, ...value })
          .select('id')
          .single();
      }

      if (res.error) {
        console.error(res.error);
        alert('Failed to save project');
      } else {
        navigate(
          '/project/:projectId/view',
          { params: { projectId: res.data.id }, replace: mayReplace() }
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
      <form.Field name='published'>
        {(field) => (
          <IonItem onClick={() => { field.handleChange(!field.state.value) }}>
            <IonLabel>Publish</IonLabel>
            <IonCheckbox
              checked={!!field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.checked) }}
            />
          </IonItem>
        )}
      </form.Field>
      <form.Field name='name'>
        {(field) => (
          <IonItem>
            <IonInput label='Name'
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
            />
          </IonItem>
        )}
      </form.Field>
      <form.Field name='image_url'>
        {(field) => (
          <IonItem>
            <IonInput label='Image URL'
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
            />
          </IonItem>
        )}
      </form.Field>
      {/* <form.Field name='owner_id'>
        {(field) => (
          <IonItem>
            <IonInput label='Owner'
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
            />
          </IonItem>
        )}
      </form.Field> */}
      <form.Field name='description'>
        {(field) => (
          <IonItem>
            <IonTextarea label='Description'
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
              rows={4}
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

export default ProjectForm;
