import { observer } from "mobx-react-lite";
import ProjectEdit from "../../../components/Project/ProjectEdit";
import { sessionStore } from "../../../domains/auth/sessionStore";

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
  const currentUser = sessionStore.current?.user.id;

  if (!currentUser) {
    return <div>You must login to create projects.</div>
  }

  return <NewProjectComponent userId={currentUser} />
})

export default NewProject;
