import { IonButton, IonCheckbox, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import { useForm } from '@tanstack/react-form';

import { IMAGE_SIZE } from '../../domains/image';
import { projectPicturePath, getPublicUrl } from '../../domains/image/image';
import { clientSupabase } from '../../domains/persistence/clientSupabase';
import { TableInsert } from '../../domains/persistence/tables';
import useDeleteProject from '../../domains/project/mutationDeleteProject';
import { mayReplace } from '../../domains/ui/navigation';
import { showToast } from '../../domains/ui/toast';
import { useNavigate } from '../../router';
import UploadImage from '../UploadImage';

type Props = {
  project: TableInsert['project'],
  userId?: string
}

const ProjectForm = ({ project, userId }: Props) => {
  const navigate = useNavigate();
  const deleteProject = useDeleteProject({ projectId: project.id, userId });
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
        showToast('Name and Admin are required', { duration: 5000, isError: true })
        return;
      }

      let res;
      if (project.id) {
        res = await clientSupabase
          .from('project')
          .update({ ...value })
          .eq('id', project.id)
          .select('id')
          .single();
      } else {
        res = await clientSupabase
          .from('project')
          .insert({ created_by: project.created_by, ...value })
          .select('id')
          .single();
      }

      if (res.error) {
        console.error(res.error);
        showToast('Failed to save project', { duration: 5000, isError: true })
      } else {
        navigate(
          '/project/:projectId/view',
          { params: { projectId: res.data.id }, replace: mayReplace() }
        )
        if (!project.id) {
          showToast('You can create a survey for attendees and/or volunteers', { duration: 5000 })
        }
      }
    }
  });

  return (
    <form className='flex flex-col' onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      void form.handleSubmit()
    }}>
      <div>
        <form.Field name='published'>
          {(field) => (
            <IonItem onClick={() => { field.handleChange(!field.state.value) }}>
              <IonLabel>Publish</IonLabel>
              <IonCheckbox
                checked={!!field.state.value}
                onIonChange={(e) => { field.handleChange(!e.detail.checked) }}
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
        {
          project.id && (
            <form.Field name='image_url'>
              {(field) => (
                <IonItem>
                  <UploadImage
                    size={IMAGE_SIZE.PROJECT_LARGE}
                    src={getPublicUrl(projectPicturePath(project.id as string))}
                    path={projectPicturePath(project.id as string)}
                    close={() => {
                      field.handleChange(getPublicUrl(projectPicturePath(project.id as string)))
                    }} />
                </IonItem>
              )}
            </form.Field>
          )
        }
        {
          !project.id && (
            <IonItem disabled>
              <IonLabel>Image</IonLabel>
              <span className='p-4'>After creating the project, an image can be attached.</span>
            </IonItem>
          )
        }
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
              <IonLabel>
                <div>Description</div>
                <div className='text-sm'>(First 150 characters used for short)</div>
              </IonLabel>
              <IonTextarea
                value={field.state.value}
                onIonChange={(e) => { field.handleChange(e.detail.value || '') }}
                rows={12}
              />
            </IonItem>
          )}
        </form.Field>
      </div>
      <div className='flex justify-around p-6'>
        {project.id && (
          <IonButton expand="block" color="danger" onClick={() => {
            if (project.id) {
              deleteProject.mutate({ projectId: project.id });
            }
            navigate('/home', { replace: true });
          }}>
            DELETE
          </IonButton>
        )}
        <IonButton type="submit" expand="block" color="secondary">
          Save
        </IonButton>
      </div>
    </form>
  );
};

export default ProjectForm;
