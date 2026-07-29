/* eslint-disable no-unused-vars */
import { CloudinaryUploadResult, SignatureResponse } from "@/types/cloudinary";

/**
 * Uploads a single file directly to Cloudinary using a signed request.
 * The file bytes never touch our backend — this is the one place in the
 * app that legitimately bypasses RTK Query, because the destination isn't
 * our API, it's Cloudinary's.
 */
export async function uploadImage(
  file: File,
  signature: SignatureResponse,
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp.toString());
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || "Image upload failed");
  }

  const data = await response.json();
  return { publicId: data.public_id, secureUrl: data.secure_url };
}

/**
 * Uploads multiple files in parallel against a single shared signature.
 */
export async function uploadMultipleImages(
  files: File[],
  signature: SignatureResponse,
  onEachDone?: (index: number) => void,
): Promise<CloudinaryUploadResult[]> {
  return Promise.all(
    files.map(async (file, index) => {
      const result = await uploadImage(file, signature);
      if (onEachDone) {
        onEachDone(index);
      }
      return result;
    }),
  );
}
