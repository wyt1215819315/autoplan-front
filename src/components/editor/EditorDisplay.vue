<template>
  <div class="editor-display" v-html="props.data" />
</template>

<script setup lang="ts">
defineOptions({
  name: "EditorDisplay"
});

const props = defineProps({
  data: {
    type: String,
    default: ""
  }
});
</script>

<style lang="scss" scoped>
.editor-display {
  ::v-deep(hr) {
    display: block;
    height: 1px;
    width: 100%;
    margin: 18px 0;
    border-top: 1px var(--el-border-color) var(--el-border-style);
  }
  ::v-deep(table) {
    border: 1px solid var(--el-border-color);
  }
  ::v-deep(td) {
    border: 1px solid var(--el-border-color);
  }
  ::v-deep(th) {
    border: 1px solid var(--el-border-color);
  }
}
</style>
