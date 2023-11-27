import { http } from "@/utils/http";
import { baseUrlApi, PageResult, Result } from "@/api/utils";

// ***********************系统配置管理***********************
export const getSystemConfigPage = (data?: object) => {
  return http.request<PageResult<any>>("post", baseUrlApi("/system/config/page"), { data });
};
export const saveSystemConfig = (data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/system/config/save"), { data });
};
export const updateSystemConfig = (data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/system/config/update"), { data });
};
export const updateSystemConfigValue = (data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/system/config/updateValue"), { data });
};
export const deleteSystemConfig = (id: number) => {
  return http.request<Result<any>>("get", baseUrlApi("/system/config/delete") + id);
};
// ***********************系统配置管理***********************

/** 获取用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<PageResult<any>>("post", "/user", { data });
};

/** 用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result<any>>("get", "/list-all-role");
};

/** 用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result<any>>("post", "/list-role-ids", { data });
};

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<PageResult<any>>("post", "/role", { data });
};

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result<any>>("post", "/dept", { data });
};
