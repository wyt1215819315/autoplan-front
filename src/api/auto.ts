import { http } from "@/utils/http";
import { baseUrlApi, PageResult, Result } from "@/api/utils";

/** 获取自动任务列表 */
export const getIndexList = () => {
  return http.request<Result>("post", baseUrlApi("/auto/index/list"));
};

/** 获取这个自动任务的表单项 */
export const getUserInfoColumn = indexId => {
  return http.request<Result>(
    "post",
    baseUrlApi("/auto/index/getUserInfoColumn/" + indexId)
  );
};

/** 分页获取任务列表 */
export const getTaskPage = (indexId: string, data?: object) => {
  return http.request<PageResult>(
    "post",
    baseUrlApi("/auto/task/" + indexId + "/page"),
    { data }
  );
};

/** 获取我的任务列表 */
export const mineTaskList = () => {
  return http.request<Result>("post", baseUrlApi("/auto/task/mine/list"));
};
