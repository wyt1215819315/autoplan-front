export default {
  path: "/auto",
  redirect: "/auto/mine",
  meta: {
    icon: "user",
    title: "我的任务",
    rank: 12
  },
  children: [
    {
      path: "/auto/mine",
      name: "MineCardList",
      component: () => import("@/views/auto/mine/index.vue"),
      meta: {
        icon: "user",
        title: "我的任务",
        showParent: false
      }
    }
  ]
} as RouteConfigsTable;
