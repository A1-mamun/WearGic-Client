import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    addUserInfo: build.mutation({
      query: ({ id, userInfo }) => ({
        url: `/auth/add-user-info/${id}`,
        method: "POST",
        body: userInfo,
      }),
    }),
  }),
});

export const { useLoginMutation, useAddUserInfoMutation } = authApi;
