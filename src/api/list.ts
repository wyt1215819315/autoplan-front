import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
  };
};

/** 版本日志 */
export const getReleases = () => {
  return http.request<Result>("get", "/releases");
};
