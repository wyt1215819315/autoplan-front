import { $t } from "@/plugins/i18n";

export default {
  path: "/about",
  redirect: "/about/index",
  meta: {
    icon: "info",
    title: $t("menus.hsAbout"),
    rank: 999
  },
  children: [
    {
      path: "/about/index",
      name: "About",
      component: () => import("@/views/about/index.vue"),
      meta: {
        icon: "info",
        title: $t("menus.hsAbout")
      }
    }
  ]
} as RouteConfigsTable;
