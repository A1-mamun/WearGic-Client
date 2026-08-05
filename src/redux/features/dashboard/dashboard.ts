import { baseApi } from "@/redux/api/baseApi";
import { DashboardOverview } from "@/types/dashboard";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardOverview: build.query<DashboardOverview, void>({
      query: () => ({
        url: "/dashboard/overview",
        method: "GET",
      }),
      transformResponse: (response: unknown): DashboardOverview =>
        (response as ApiEnvelope<DashboardOverview>).data,
      providesTags: [{ type: "Product", id: "DASHBOARD" }],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
