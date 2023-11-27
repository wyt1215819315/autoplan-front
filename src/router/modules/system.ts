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
        title: "配置管理",
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
