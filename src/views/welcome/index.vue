<script setup lang="ts">
import dayjs from "dayjs";
import MdEditor from "md-editor-v3";
import Bar from "./components/Bar.vue";
import Pie from "./components/Pie.vue";
import Line from "./components/Line.vue";
import { getReleases } from "@/api/list";
import TypeIt from "@/components/ReTypeit";
import { useWindowSize } from "@vueuse/core";
import { ref, computed, markRaw } from "vue";
import Github from "./components/Github.vue";
import { isAllEmpty, randomColor } from "@pureadmin/utils";
import { useRenderFlicker } from "@/components/ReFlicker";
import { viewNotice } from "@/api/system/notice";
import EditorDisplay from "@/components/editor/EditorDisplay.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { router } from "@/router";

defineOptions({
  name: "Welcome"
});

const versionLogList = ref();
const noticeInfo = ref<string>();
const loading = ref<boolean>(true);
const { version } = __APP_INFO__.pkg;
const titleClass = computed(() => {
  return ["text-base", "font-bold"];
});

const { height } = useWindowSize();

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

getReleases().then(({ data }) => {
  versionLogList.value = data.list.map((v) => {
    return {
      content: v.body,
      timestamp: dayjs(v.published_at).format("YYYY/MM/DD hh:mm:ss A"),
      icon: markRaw(
        useRenderFlicker({
          background: randomColor({ type: "hex" }) as string
        })
      )
    };
  });
});

// 获取公告内容
viewNotice().then((data) => {
  noticeInfo.value = data.data;
});

function pushEditNotice() {
  router.push("/system/notice-editor");
}
</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col
        class="card"
        :span="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card shadow="never">
          <template #header>
            <a :class="titleClass" target="_black">
              <TypeIt :className="'type-it1'" :values="[`公告栏`]" :cursor="false" :speed="60" />
            </a>
            <el-button class="float-right" v-if="useUserStoreHook().isAdmin()" plain @click="pushEditNotice">编辑</el-button>
          </template>
          <el-empty v-if="isAllEmpty(noticeInfo)" description="当前无公告" />
          <EditorDisplay :data="noticeInfo" />
        </el-card>
      </el-col>

      <el-col
        class="card"
        :span="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card shadow="never">
          <template #header>
            <a :class="titleClass" href="https://github.com/pure-admin/vue-pure-admin/releases" target="_black">
              <TypeIt :className="'type-it2'" :values="[`PureAdmin 版本日志（当前版本 v${version}）`]" :cursor="false" :speed="60" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar :height="`calc(${height}px - 35vh - 340px)`">
                <el-timeline v-show="versionLogList?.length > 0">
                  <el-timeline-item v-for="(item, index) in versionLogList" :key="index" :icon="item.icon" :timestamp="item.timestamp">
                    <md-editor v-model="item.content" preview-only />
                  </el-timeline-item>
                </el-timeline>
                <el-empty v-show="versionLogList?.length === 0" />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card shadow="never">
          <template #header>
            <a :class="titleClass" href="https://github.com/pure-admin/vue-pure-admin" target="_black">
              <TypeIt :className="'type-it3'" :values="['GitHub饼图信息']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Pie />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card shadow="never">
          <template #header>
            <a :class="titleClass" href="https://github.com/pure-admin/vue-pure-admin" target="_black">
              <TypeIt :className="'type-it5'" :values="['GitHub柱状图信息']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Bar />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 20px 20px 0 !important;
}

.card {
  margin-bottom: 20px;
}
</style>
