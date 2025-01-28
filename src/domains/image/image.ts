import { clientSupabase } from "../persistence/clientSupabase";

export function profilePicturePath(userId: string) {
  return `profile/user_id_${userId}.jpg`;
}

export function projectPicturePath(projectId: string) {
  return `project/id_${projectId}.jpg`;
}

export function getPublicUrl(path: string) {
  const { data } = clientSupabase.storage
    .from("public-images")
    .getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadImage(path: string, base64Image: string) {
  const response = await fetch(base64Image);
  const blob = await response.blob();

  const { error } = await clientSupabase.storage
    .from("public-images")
    .upload(path, blob, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    throw error;
  }
}
