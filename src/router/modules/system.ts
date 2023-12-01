import { $t } from "@/plugins/i18n";

export default {
  path: "/system",
  meta: {
    icon: "setting",
    title: "系统管理",
    rank: 12
  },
  children: [
    {
      path: "/system/config",
      name: "SystemConfigPage",
      component: () => import("@/views/system/config/index.vue"),
      meta: {
        icon: "setting",
        title: "配置管理"
      }
    },
    {
      path: "/system/user",
      name: "User",
      component: () => import("@/views/system/user/index.vue"),
      meta: {
        icon: "user",
        title: "用户管理"
      }
    },
    {
      path: "/system/notice-editor",
      name: "Editor",
      component: () => import("@/views/system/notice-editor/index.vue"),
      meta: {
        icon: "edit",
        title: "公告编辑",
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
