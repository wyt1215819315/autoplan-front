import { http } from "@/utils/http";
import { baseUrlApi, Result } from "@/api/utils";

/** 获取自动任务列表 */
export const getIndexList = () => {
  return http.request<Result>("post", baseUrlApi("/auto/index/list"));
};
