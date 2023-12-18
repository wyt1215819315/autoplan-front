import { http } from "@/utils/http";
import { baseUrlApi, PageResult, Result } from "@/api/utils";

export class AutoIndex {
  id: any;
  name: string;
  code: string;
  icon: string;
}

export class AutoTask {
  id: any;
  indexId: any;
  userId: any;
  onlyId: string;
  code: string;
  enable: number;
  name: string;
  setting: object;
  userInfo: object;
  lastEndTime: string;
  lastEndStatus: number;
}

/** 获取所有动态表单字段 */
export const getColumn = () => {
  return http.request<Result<any>>("get", baseUrlApi("/auto/index/getColumn"));
};

/** 获取自动任务列表 */
export const getIndexList = () => {
  return http.request<Result<Array<AutoIndex>>>("get", baseUrlApi("/auto/index/list"));
};

/** 根据id获取这个自动任务的详情 */
export const getIndexInfo = (indexId) => {
  return http.request<Result<AutoIndex>>("get", baseUrlApi("/auto/index/view/" + indexId));
};

/** 获取这个自动任务的表单项 */
export const getUserInfoColumn = (indexId) => {
  return http.request<Result<any>>("get", baseUrlApi("/auto/index/getUserInfoColumn/" + indexId));
};

/** 获取这个自动任务的配置表单项 */
export const getSettingColumn = (indexId) => {
  return http.request<Result<any>>("get", baseUrlApi("/auto/index/getSettingColumn/" + indexId));
};

/** 分页获取任务列表 */
export const getTaskPage = (indexId: string, data?: object) => {
  return http.request<PageResult<any>>("get", baseUrlApi("/auto/task/" + indexId + "/page"), data);
};

/** view任务详情 */
export const viewTask = (taskId: any) => {
  return http.request<Result<any>>("get", baseUrlApi("/auto/task/view/" + taskId));
};

/** 删除任务 */
export const deleteTask = (taskId: any) => {
  return http.request<Result<any>>("get", baseUrlApi("/auto/task/delete/" + taskId));
};

/** 单次执行任务 */
export const runTask = (taskId: any) => {
  return http.request<Result<any>>("get", baseUrlApi("/auto/task/run/" + taskId));
};

/** 仅校验任务 */
export const checkTask = (indexId: string, data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/auto/task/" + indexId + "/check"), { data });
};

/** 编辑情况下的仅校验任务 */
export const checkTaskWithUpdate = (data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/auto/task/checkUserWithTask"), { data });
};

/** 校验任务并保存 */
export const checkAndSaveTask = (indexId: string, data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/auto/task/" + indexId + "/checkAndSave"), { data });
};

/** 校验任务并更新 */
export const checkAndUpdate = (data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/auto/task/checkAndUpdate"), { data });
};

/** 获取我的任务列表 */
export const mineTaskPage = (data?: object) => {
  return http.request<PageResult<AutoTask>>("get", baseUrlApi("/auto/task/mine/page"), data);
};
