import { storeToRefs } from "pinia";
import { getConfig } from "@/config";
import { useRouter } from "vue-router";
import { emitter } from "@/utils/mitt";
import { routeMetaType } from "../types";
import userAvatar from "@/assets/user.jpg";
import { getTopMenu } from "@/router/utils";
import { isAllEmpty, useGlobal } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { router, remainingPaths } from "@/router";
import { computed, type CSSProperties, ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import { useUserStoreHook } from "@/store/modules/user";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { addDialog } from "@/components/ReDialog/index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";
import { editSelfPassword } from "@/api/system/user";
import { message } from "@/utils/message";
import { md5 } from "@/utils/crypto";

const errorInfo = "当前路由配置不正确，请检查配置";

export function useNav() {
  const pureApp = useAppStoreHook();
  const routers = useRouter().options.routes;
  const { wholeMenus } = storeToRefs(usePermissionStoreHook());
  /** 平台`layout`中所有`el-tooltip`的`effect`配置，默认`light` */
  const tooltipEffect = getConfig()?.TooltipEffect ?? "light";

  const getDivStyle = computed((): CSSProperties => {
    return {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden"
    };
  });

  /** 用户名 */
  const username = computed(() => {
    return useUserStoreHook()?.username;
  });

  /** 设置国际化选中后的样式 */
  const getDropdownItemStyle = computed(() => {
    return (locale, t) => {
      return {
        background: locale === t ? useEpThemeStoreHook().epThemeColor : "",
        color: locale === t ? "#f4f4f5" : "#000"
      };
    };
  });

  const getDropdownItemClass = computed(() => {
    return (locale, t) => {
      return locale === t ? "" : "dark:hover:!text-primary";
    };
  });

  const avatarsStyle = computed(() => {
    return username.value ? { marginRight: "10px" } : "";
  });

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus;
  });

  const device = computed(() => {
    return pureApp.getDevice;
  });

  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  const layout = computed(() => {
    return $storage?.layout?.layout;
  });

  const title = computed(() => {
    return $config.Title;
  });

  /** 动态title */
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    if (Title) document.title = `${transformI18n(meta.title)} | ${Title}`;
    else document.title = transformI18n(meta.title);
  }

  /** 退出登录 */
  function logout() {
    useUserStoreHook().logOut();
  }

  function backTopMenu() {
    router.push(getTopMenu()?.path);
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function toggleSideBar() {
    pureApp.toggleSideBar();
  }

  function handleResize(menuRef) {
    menuRef?.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo);
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(indexPath: string) {
    if (wholeMenus.value.length === 0 || isRemaining(indexPath)) return;
    emitter.emit("changLayoutRoute", indexPath);
  }

  /** 判断路径是否参与菜单 */
  function isRemaining(path: string) {
    return remainingPaths.includes(path);
  }

  /** 获取`logo` */
  function getLogo() {
    return new URL("/logo.svg", import.meta.url).href;
  }

  /** 修改密码 */
  function editPassword() {
    const passwordForm = ref({
      password: "",
      rePassword: ""
    });
    const repeatPasswordRule = [
      { require: true },
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error(transformI18n($t("login.passwordSureReg"))));
          } else if (passwordForm.value.password !== value) {
            callback(new Error(transformI18n($t("login.passwordDifferentReg"))));
          } else {
            callback();
          }
        },
        trigger: "blur"
      }
    ];
    addDialog({
      title: "修改密码",
      contentRenderer: () => (
        <el-form model={passwordForm.value}>
          <el-form-item rules={[{ require: true }, { max: 18, min: 6, message: "密码必须介于6到18位" }]} prop="password">
            <el-input
              clearable
              show-password
              v-model={passwordForm.value.password}
              placeholder={transformI18n($t("login.password"))}
              prefix-icon={useRenderIcon(Lock)}
            />
          </el-form-item>
          <el-form-item rules={repeatPasswordRule} prop="rePassword">
            <el-input
              clearable
              show-password
              v-model={passwordForm.value.rePassword}
              placeholder={transformI18n($t("login.sure"))}
              prefix-icon={useRenderIcon(Lock)}
            />
          </el-form-item>
        </el-form>
      ),
      beforeSure: (done) => {
        if (isAllEmpty(passwordForm.value.password)) {
          message("密码不能为空！");
          return;
        }
        editSelfPassword({
          password: md5(passwordForm.value.password)
        }).then((data) => {
          if (data.success) {
            message("修改成功！", { type: "success" });
            done();
          }
        });
      }
    });
  }

  return {
    title,
    device,
    layout,
    logout,
    routers,
    $storage,
    backTopMenu,
    onPanel,
    getDivStyle,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    getLogo,
    isCollapse,
    pureApp,
    username,
    userAvatar,
    avatarsStyle,
    tooltipEffect,
    getDropdownItemStyle,
    getDropdownItemClass,
    editPassword
  };
}
