import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageLocal } from "@pureadmin/utils";
import { getLogin, logout, refreshTokenApi } from "@/api/system/user";
import { UserResult, RefreshTokenResult } from "@/api/system/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0
  }),
  actions: {
    isAdmin() {
      return !!this.roles.includes("ADMIN");
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then((data) => {
            if (data.success) {
              setToken(data.data);
            }
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /** 登出 */
    logOut() {
      this.username = "";
      this.roles = [];
      logout().then(() => {
        removeToken();
        useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
        resetRouter();
        router.push("/login");
      });
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then((data) => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
