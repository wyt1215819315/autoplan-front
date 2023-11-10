export default {
  path: "/auto/task",
  name: "TaskInfoPage",
  component: () => import("@/views/auto/task/index.vue"),
  meta: {
    icon: "card",
    title: "",
    showLink: false
  }
} as RouteConfigsTable;
