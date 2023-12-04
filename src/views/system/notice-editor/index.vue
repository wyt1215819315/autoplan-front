<script setup lang="ts">
import WangEditor from "@/components/editor/WangEditor.vue";
import { editNotice, viewNotice } from "@/api/system/notice";
import { ref } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "Editor"
});

const noticeInfo = ref<string>();
const noticeResult = ref<string>();

viewNotice().then((data) => {
  noticeInfo.value = data.data;
});

function edit() {
  editNotice({
    text: noticeResult.value
  }).then((data) => {
    if (data.success) {
      message("修改成功！", { type: "success" });
    }
  });
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-bold"> 首页公告编辑器 </span>
      </div>
    </template>
    <WangEditor :data="noticeInfo" @change="(val: string) => (noticeResult = val)" />
    <el-button @click="edit">修改</el-button>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  padding-left: 10px;
}
</style>
