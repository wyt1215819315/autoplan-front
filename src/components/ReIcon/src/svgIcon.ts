import { defineAsyncComponent } from "vue";

export const svgIcon = {
  GenshinCryo: defineAsyncComponent(() => import("@/assets/svg/mysvg/genshin-cryo.svg")),
  Bilibili: defineAsyncComponent(() => import("@/assets/svg/mysvg/bilibili.svg")),
  CloudDriver: defineAsyncComponent(() => import("@/assets/svg/mysvg/cloud-driver.svg"))
};
