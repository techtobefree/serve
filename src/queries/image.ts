import { supabase } from "../domains/db/supabaseClient";

export function profilePicturePath(userId: string) {
  return `profile/user_id_${userId}.jpg`
}

export function projectPicturePath(projectId: string) {
  return `project/id_${projectId}.jpg`
}

export function getPublicUrl(path: string) {
  const { data } = supabase.storage.from('public-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadImage(path: string, base64Image: string) {
  const response = await fetch(base64Image);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from('public-images')
    .upload(path, blob, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error('Upload error:', error.message);



    // await supabase.storage
    //   .from('public-images')
    //   .remove([profilePicturePath(userId)]);
    // const { data, error } = await supabase.storage
    //   .from('public-images')
    //   .list('profile', { limit: 100 });
    // console.log(data, error);



    // const { data: data2, error: error2 } = await supabase.storage
    //   .from('public-images')
    //   .upload(profilePicturePath(userId), blob, {
    //     contentType: 'image/jpeg',
    //   });
    // if (error2) {
    //   console.error('Upload error:', error2.message);
    // } else {
    //   console.log('File uploaded successfully:', data2);
    // }
  } else {
    console.log('File uploaded successfully:', data);
  }
}
