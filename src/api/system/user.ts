import { http } from "@/utils/http";
import { baseUrlApi, Result } from "@/api/utils";

export type UserResult = {
  success: boolean;
  code: number;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("/auth/formLogin"), {
    data
  });
};

/** 登录 */
export const editSelfPassword = (data?: object) => {
  return http.request<Result<any>>("post", baseUrlApi("/auth/editSelfPassword"), {
    data
  });
};

/** 注册 */
export const doReg = (data?: object) => {
  return http.request<UserResult>(
    "post",
    baseUrlApi("/reg/doReg"),
    {
      data
    },
    null,
    true
  );
};

/** 登出 */
export const logout = () => {
  return http.request<UserResult>("get", baseUrlApi("/auth/logout"));
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};
