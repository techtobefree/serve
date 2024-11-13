import { IonButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { observer } from "mobx-react-lite";

import ProjectEdit from "../../../components/Project/ProjectEdit";
import { sessionStore } from "../../../domains/auth/sessionStore";
import { useModals, useNavigate } from "../../../router";

type Props = {
  userId: string;
}

export function NewProjectComponent({ userId }: Props) {
  return (
    <div>
      <ProjectEdit project={{ admin_id: userId, created_by: userId, name: 'New Project' }} />
    </div>
  )
}

const NewProject = observer(() => {
  const modals = useModals();
  const navigate = useNavigate();
  const currentUser = sessionStore.current?.user.id;

  if (!currentUser) {
    return <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack} onClick={() => { navigate(-1) }} />
      </div>
      <div>You must login to create projects.</div>
      <IonButton onClick={() => { modals.open('/profile') }}>Login</IonButton>
    </>
  }

  return (
    <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack} onClick={() => { navigate(-1) }} />
      </div>
      <NewProjectComponent userId={currentUser} />
    </>
  )
})

export default NewProject;
