import { IonButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { observer } from "mobx-react-lite";

import ProjectEdit from "../../../components/Project/ProjectEdit";
import { userStore } from "../../../domains/auth/sessionStore";
import { useModals, useNavigate } from "../../../router";

type Props = {
  userId: string;
}

export function NewProjectComponent({ userId }: Props) {
  return (
    <div className="flex w-full justify-center">
      <div className="max-w-[800px] w-full">
        <ProjectEdit project={{
          owner_id: userId,
          created_by: userId,
          name: 'New Project'
        }} />
      </div>
    </div>
  )
}

const NewProject = observer(() => {
  const modals = useModals();
  const navigate = useNavigate();
  const currentUserId = userStore.current?.id;

  if (!currentUserId) {
    return <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack} onClick={() => { navigate(-1) }} />
      </div>
      <div>You must login to create projects.</div>
      <IonButton color="secondary" onClick={() => { modals.open('/profile') }}>Login</IonButton>
    </>
  }

  return (
    <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack} onClick={() => { navigate(-1) }} />
      </div>
      <NewProjectComponent userId={currentUserId} />
    </>
  )
})

export default NewProject;
