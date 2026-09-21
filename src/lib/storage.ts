import { supabase } from "@/integrations/supabase/client";

export async function uploadFile(bucket: string, file: File, prefix = "") {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${prefix}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;
  return `${bucket}/${path}`;
}

export async function signedUrl(storageRef: string | null | undefined) {
  if (!storageRef) return null;
  const [bucket, ...rest] = storageRef.split("/");
  if (!bucket || rest.length === 0) return null;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(rest.join("/"), 60 * 60);
  return data?.signedUrl ?? null;
}
