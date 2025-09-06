import { baseApi } from "@/redux/api/baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createContact: build.mutation({
      query: (contactInfo) => ({
        url: "/auth/send-mail",
        method: "POST",
        body: contactInfo,
      }),
    }),
  }),
});

export const { useCreateContactMutation } = contactApi;
