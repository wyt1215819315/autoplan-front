import { http } from "@/utils/http";
import { baseUrlApi, PageResult, Result } from "@/api/utils";

/** 分页获取定时任务列表 */
export const getJobPage = (data?: object) => {
  return http.request<PageResult>("post", baseUrlApi("/admin/job/page"), {
    data
  });
};

/** 更新定时任务 */
export const updateJob = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/admin/job/update"), {
    data
  });
};

/** 删除定时任务 */
export const deleteJob = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/admin/job/delete"), {
    data
  });
};

/** 保存定时任务 */
export const saveJob = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/admin/job/save"), {
    data
  });
};

/** 保存定时任务 */
export const changeJobStatus = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/admin/job/changeStatus"), {
    data
  });
};

/** 查看任务详情 */
export const viewJob = (id: string) => {
  return http.request<Result>("get", baseUrlApi("/admin/job/view/" + id));
};

/** 查看任务详情 */
export const runJob = (id: string) => {
  return http.request<Result>("get", baseUrlApi("/admin/job/run/" + id));
};

//******************************日志部分******************************

/** 获取定时任务日志分页 */
export const getJobLogPage = (data?: object) => {
  return http.request<PageResult>("post", baseUrlApi("/admin/joblog/page"), { data });
};

/** 查看任务日志详情 */
export const viewJobLog = (id: string) => {
  return http.request<Result>("get", baseUrlApi("/admin/joblog/view/" + id));
};

/** 删除定时任务日志 */
export const deleteJobLog = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/admin/joblog/delete"), { data });
};

/** 删除全部定时任务日志 */
export const deleteAllJobLog = () => {
  return http.request<Result>("post", baseUrlApi("/admin/joblog/deleteAll"));
};

export const getNextExecution = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/admin/job/getNextExecution"), { data });
};
