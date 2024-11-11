import { useForm } from '@tanstack/react-form';
import { IonButton, IonCheckbox, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import { supabase } from '../../domains/db/supabaseClient';
import { TableInsert } from '../../domains/db/tables';
import { useNavigate } from '../../router';
import { mayReplace } from '../../domains/ui/navigation';

type Props = {
  project: TableInsert['project']
}

const ProjectForm = ({ project }: Props) => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: project.name,
      unlisted: project.unlisted,
      description: project.description || '',
      image_url: project.image_url || '',
      admin_id: project.admin_id || '',
    },
    onSubmit: async ({ value }) => {
      if (!value.name || !value.admin_id) {
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
        navigate('/project/:projectId/view', { params: { projectId: res.data.id }, replace: mayReplace() })
      }
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      void form.handleSubmit()
    }}>
      <form.Field name='unlisted'>
        {(field) => (
          <IonItem onClick={() => { field.handleChange(!field.state.value) }}>
            <IonLabel>List on catalog</IonLabel>
            <IonCheckbox
              checked={!field.state.value} // `checked` is preferred over `value` for checkboxes
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
      <form.Field name='admin_id'>
        {(field) => (
          <IonItem>
            <IonInput label='Admin'
              value={field.state.value}
              onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
            />
          </IonItem>
        )}
      </form.Field>
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
