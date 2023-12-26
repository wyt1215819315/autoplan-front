import { http } from "@/utils/http";
import { baseUrlApi, PageResult, Result } from "@/api/utils";
export const getAutoIndexPage = (data: object) => {
  return http.request<PageResult<any>>("get", baseUrlApi("/auto/index/admin/page"), data);
};

export const updateAutoIndex = (data: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/auto/index/admin/update"), { data });
};

export const changeAutoIndexStatus = (data: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/auto/index/admin/changeEnable"), { data });
};
