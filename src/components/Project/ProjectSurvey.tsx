import { IonButton, IonCheckbox, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';

import { clientSupabase } from '../../domains/db/clientSupabase';
import { TableInsert } from '../../domains/db/tables';
import { IMAGE_SIZE } from '../../domains/image';
import { mayReplace } from '../../domains/ui/navigation';
import { showToast } from '../../domains/ui/toast';
import { projectPicturePath, getPublicUrl } from '../../queries/image';
import { useNavigate } from '../../router';
import UploadImage from '../UploadImage';
import useDeleteProject from '../../mutations/deleteProject';

type Props = {
  project: TableInsert['project'],
  userId?: string
}

const ProjectForm = ({ project, userId }: Props) => {
  const navigate = useNavigate();
  const deleteProject = useDeleteProject({ projectId: project.id, userId });

  return (
    <div></div>
  );
};

export default ProjectForm;
