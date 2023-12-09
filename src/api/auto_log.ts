import { http } from "@/utils/http";
import { baseUrlApi, PageResult, Result } from "@/api/utils";

class HistoryTaskLog {
  id: number;
  taskId: number;
  type: string;
  status: number;
  userId: number;
  date: string;
  text: string;
}

export const getNearlyLogByCode = (code: string) => {
  return http.request<Result<HistoryTaskLog>>("get", baseUrlApi("/taskLog/getNearlyLogByCode/" + code));
};

export const getNearlyLogByTaskId = (taskId: any) => {
  return http.request<Result<HistoryTaskLog>>("get", baseUrlApi("/taskLog/getNearlyLogByTaskId/" + taskId));
};

//*********************管理员部分*********************

export const getAutoLogList = (data: object) => {
  return http.request<PageResult<HistoryTaskLog>>("post", baseUrlApi("/taskLog/list"), { data });
};

export const viewLog = (id: any) => {
  return http.request<Result<HistoryTaskLog>>("get", baseUrlApi("/taskLog/view/" + id));
};
