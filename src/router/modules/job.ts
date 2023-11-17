export default {
  path: "/job",
  redirect: "/job/manager",
  meta: {
    icon: "watch",
    title: "自动任务管理",
    rank: 11,
    roles: ["ADMIN"]
  },
  children: [
    {
      path: "/job/manager",
      name: "QuartzManager",
      component: () => import("@/views/job/manager/index.vue"),
      meta: {
        icon: "edit-pen",
        title: "定时任务管理",
        keepAlive: true
      }
    },
    {
      path: "/job/log",
      name: "QuartzLog",
      component: () => import("@/views/job/log/index.vue"),
      meta: {
        icon: "data-board",
        title: "定时任务日志查看",
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
