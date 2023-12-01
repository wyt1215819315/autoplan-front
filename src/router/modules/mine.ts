export default {
  path: "/personal",
  meta: {
    icon: "user",
    title: "个人中心",
    rank: 12
  },
  children: [
    {
      path: "/personal/task",
      name: "MineCardList",
      component: () => import("@/views/auto/mine/index.vue"),
      meta: {
        icon: "calendar",
        title: "我的任务"
      }
    },
    {
      path: "/personal/webhook",
      name: "MineWebhookPage",
      component: () => import("@/views/auto/webhook/index.vue"),
      meta: {
        icon: "chat-dot-square",
        title: "推送配置"
      }
    }
  ]
} as RouteConfigsTable;
