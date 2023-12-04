import { http } from "@/utils/http";
import { baseUrlApi, Result } from "@/api/utils";

export const viewNotice = () => {
  return http.request<Result<any>>("get", baseUrlApi("/index/notice/view"));
};

export const editNotice = (data: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/index/notice/edit"), { data });
};
