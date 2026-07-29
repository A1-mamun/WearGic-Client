/* eslint-disable no-console */
"use client";

import { useState, useCallback, useRef } from "react";
import { uploadImage, uploadMultipleImages } from "@/services/cloudinary";
import {
  useLazyGetUploadSignatureQuery,
  useDeleteOrphanImagesMutation,
} from "@/redux/features/cloudinary/cloudinary";
import { CloudinaryUploadResult } from "@/types/cloudinary";

interface UploadProgressState {
  isUploading: boolean;
  uploadedCount: number;
  totalCount: number;
  stage: "idle" | "uploading" | "done" | "error";
  error?: string;
}

interface UploadAllParams {
  coverImage: File;
  variantImages: File[];
  bulkImages: File[];
}

interface UploadAllResult {
  coverImage: CloudinaryUploadResult;
  variantImages: CloudinaryUploadResult[];
  bulkImages: CloudinaryUploadResult[];
}

export function useCloudinaryUpload() {
  const [progress, setProgress] = useState<UploadProgressState>({
    isUploading: false,
    uploadedCount: 0,
    totalCount: 0,
    stage: "idle",
  });

  const [fetchSignature] = useLazyGetUploadSignatureQuery();
  const [deleteOrphans] = useDeleteOrphanImagesMutation();
  const uploadedPublicIdsRef = useRef<string[]>([]);

  const reset = useCallback(() => {
    setProgress({
      isUploading: false,
      uploadedCount: 0,
      totalCount: 0,
      stage: "idle",
    });
    uploadedPublicIdsRef.current = [];
  }, []);

  /**
   * Uploads a cover image + variant images + bulk images, in that order,
   * tracking overall progress across all of them. Throws immediately on
   * first failure — caller is expected to stop and not call create-product.
   */
  const uploadAll = useCallback(
    async (params: UploadAllParams): Promise<UploadAllResult> => {
      const total = 1 + params.variantImages.length + params.bulkImages.length;

      setProgress({
        isUploading: true,
        uploadedCount: 0,
        totalCount: total,
        stage: "uploading",
      });

      const uploaded: string[] = [];

      try {
        const signature = await fetchSignature({ folder: "products" }).unwrap();

        // Step 1: cover image
        const cover = await uploadImage(params.coverImage, signature);
        uploaded.push(cover.publicId);
        setProgress((p) => ({ ...p, uploadedCount: p.uploadedCount + 1 }));

        // Step 2: variant images, in parallel
        const variants = await uploadMultipleImages(
          params.variantImages,
          signature,
          () =>
            setProgress((p) => ({ ...p, uploadedCount: p.uploadedCount + 1 })),
        );
        uploaded.push(...variants.map((v) => v.publicId));

        // Step 3: bulk images, in parallel
        const bulk = await uploadMultipleImages(
          params.bulkImages,
          signature,
          () =>
            setProgress((p) => ({ ...p, uploadedCount: p.uploadedCount + 1 })),
        );
        uploaded.push(...bulk.map((b) => b.publicId));

        uploadedPublicIdsRef.current = uploaded;
        setProgress((p) => ({ ...p, isUploading: false, stage: "done" }));

        return { coverImage: cover, variantImages: variants, bulkImages: bulk };
      } catch (err) {
        setProgress((p) => ({
          ...p,
          isUploading: false,
          stage: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        }));
        throw err;
      }
    },
    [fetchSignature],
  );

  /**
   * Uploads a set of files without the cover/variant/bulk structure —
   * used by the Edit modal, which may only have a handful of changed
   * variant images and no cover/bulk changes at all.
   */
  const uploadFiles = useCallback(
    async (files: File[]): Promise<CloudinaryUploadResult[]> => {
      if (files.length === 0) return [];

      setProgress({
        isUploading: true,
        uploadedCount: 0,
        totalCount: files.length,
        stage: "uploading",
      });

      try {
        const signature = await fetchSignature({ folder: "products" }).unwrap();
        const results = await uploadMultipleImages(files, signature, () =>
          setProgress((p) => ({ ...p, uploadedCount: p.uploadedCount + 1 })),
        );
        uploadedPublicIdsRef.current.push(...results.map((r) => r.publicId));
        setProgress((p) => ({ ...p, isUploading: false, stage: "done" }));
        return results;
      } catch (err) {
        setProgress((p) => ({
          ...p,
          isUploading: false,
          stage: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        }));
        throw err;
      }
    },
    [fetchSignature],
  );

  /**
   * Call this if create-product / update-product fails AFTER a successful
   * upload — removes the now-orphaned Cloudinary assets.
   */
  const rollbackUploads = useCallback(async () => {
    if (uploadedPublicIdsRef.current.length) {
      try {
        await deleteOrphans({
          publicIds: uploadedPublicIdsRef.current,
        }).unwrap();
      } catch (err) {
        console.log("Failed to clean up orphan images:", err);
      }
    }
  }, [deleteOrphans]);

  return { progress, uploadAll, uploadFiles, rollbackUploads, reset };
}
