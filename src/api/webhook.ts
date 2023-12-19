import { http } from "@/utils/http";
import { BaseTableList, baseUrlApi, Result } from "@/api/utils";

class SysWebhook extends BaseTableList {
  id: number;
  userId: number;
  name: string;
  type: string;
  data: string;
}

/** 获取所有动态表单字段 */
export const getColumn = () => {
  return http.request<Result<any>>("get", baseUrlApi("/system/webhook/getColumn"));
};

/** 获取我的webhook列表 */
export const getWebHookList = () => {
  return http.request<Result<Array<SysWebhook>>>("get", baseUrlApi("/system/webhook/list"));
};

/** 删除webhook */
export const deleteWebhook = (id: any) => {
  return http.request<Result<any>>("get", baseUrlApi("/system/webhook/delete/" + id));
};

/** 查看webhook详情 */
export const viewWebhook = (id: any) => {
  return http.request<Result<any>>("get", baseUrlApi("/system/webhook/view/" + id));
};

/** 新增修改webhook */
export const saveOrUpdateWebhook = (data: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/system/webhook/saveOrUpdate"), { data }, null, false, false);
};

/** 修改webhook状态 */
export const changeWebhookStatus = (data: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/system/webhook/changeStatus"), { data });
};

/** 校验webhook */
export const checkWebhook = (data: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/system/webhook/check"), { data }, null, false, false);
};
