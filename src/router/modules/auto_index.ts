import { list } from "@/router/enums";
import { getIndexList } from "@/api/auto";

async function buildChild() {
  const result = await getIndexList();
  const children = [];
  for (const obj of result.data) {
    const res = {
      path: "/auto/task",
      name: obj.name,
      component: () => import("@/views/auto/index/index.vue"),
      query: {
        id: obj.id
      },
      meta: {
        icon: "card",
        title: obj.name,
        showParent: true
      }
    };
    children.push(res);
  }
  return children;
}

export default {
  path: "/auto",
  redirect: "/auto/index",
  meta: {
    icon: "listCheck",
    title: "自动任务列表",
    rank: list
  },
  children: await buildChild()
} as RouteConfigsTable;
