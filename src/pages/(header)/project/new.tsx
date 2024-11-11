import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { observer } from "mobx-react-lite";

import ProjectEdit from "../../../components/Project/ProjectEdit";
import { sessionStore } from "../../../domains/auth/sessionStore";
import { useNavigate } from "../../../router";

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
  const navigate = useNavigate();
  const currentUser = sessionStore.current?.user.id;

  if (!currentUser) {
    return <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack} onClick={() => { navigate(-1) }} />
      </div>
      <div>You must login to create projects.</div>
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
