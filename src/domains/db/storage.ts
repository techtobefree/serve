import { v4 as uuid } from 'uuid'; // You will need to install the 'uuid' package
import { supabase } from "./supabaseClient";

export async function uploadImage(image: string): Promise<string> {
  const { error } = await supabase.storage
    .from('public-images') // Choose your bucket
    .upload(uuid() as string, image); // Path in the bucket

  if (error) {
    console.error(error);
    throw new Error('Failed to save image')
  } else {
    // After the image is uploaded, you can get the public URL
    const publicUrl = supabase.storage.from('project-images').getPublicUrl('project-1-image.jpg').data.publicUrl;
    console.log(publicUrl); // Save this URL to your 'projects' table
    return publicUrl;
  }
}
