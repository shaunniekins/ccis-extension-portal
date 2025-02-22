import { supabase } from "./supabase";

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(path, file);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteFile(path: string) {
  const { error } = await supabase.storage.from("documents").remove([path]);

  if (error) {
    throw error;
  }
}

export function getPublicUrl(path: string) {
  const { data } = supabase.storage.from("documents").getPublicUrl(path);

  return data.publicUrl;
}
