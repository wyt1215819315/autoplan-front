<script setup lang="ts">
import WangEditor from "@/components/editor/WangEditor.vue";

defineOptions({
  name: "Editor"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-bold"> 首页公告编辑器 </span>
      </div>
    </template>
    <WangEditor />
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  padding-left: 10px;
}
</style>
