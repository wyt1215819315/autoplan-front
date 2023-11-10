import { http } from "@/utils/http";
import { baseUrlApi, Result } from "@/api/utils";

export const getAsyncRoutes = () => {
  return http.request<Result>("get", baseUrlApi("/router/getAsyncRouter"));
};
