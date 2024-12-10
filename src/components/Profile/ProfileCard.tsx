import { IMAGE_SIZE } from "../../domains/image";
import { useBasicProfileQuery } from "../../queries/basicProfileByUserId";
import { getPublicUrl, profilePicturePath } from "../../queries/image";
import { useNavigate } from "../../router";
import Avatar from "../Avatar";

type Props = {
  size: IMAGE_SIZE;
  userId: string;
}

export default function ProfileCard({ size, userId }: Props) {
  const navigate = useNavigate();
  const { data: user } = useBasicProfileQuery(userId);

  return (
    <div className='flex items-center justify-center flex-wrap cursor-pointer'
      onClick={() => { navigate('/user/:userId/view', { params: { userId } }) }}>
      <Avatar
        size={size}
        alt='Profile picture'
        src={getPublicUrl(profilePicturePath(userId))} />
      <div className='ml-2'>{user?.handle}</div>
    </div>
  )
}
