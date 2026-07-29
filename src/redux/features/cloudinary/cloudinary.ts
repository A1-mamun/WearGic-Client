import { baseApi } from "@/redux/api/baseApi";
import { SignatureResponse } from "@/types/cloudinary";

export const cloudinaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUploadSignature: builder.query<SignatureResponse, { folder?: string }>({
      query: (params) => ({
        url: "/cloudinary/signature",
        method: "GET",
        params: { folder: params?.folder ?? "products" },
      }),
      transformResponse: (response: unknown): SignatureResponse =>
        (response as { data: SignatureResponse }).data,
    }),

    deleteOrphanImages: builder.mutation<void, { publicIds: string[] }>({
      query: (body) => ({
        url: "/cloudinary/cleanup",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLazyGetUploadSignatureQuery, useDeleteOrphanImagesMutation } =
  cloudinaryApi;
