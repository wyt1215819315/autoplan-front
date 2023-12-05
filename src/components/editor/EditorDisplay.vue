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
  color: var(--el-text-color-regular);
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
  ::v-deep(a) {
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 15px;
    font-weight: 500;
    color: var(--el-color-primary);
  }
  ::v-deep(p) {
    margin-bottom: 1rem;
  }
  ::v-deep(a:hover) {
    padding-bottom: 2px;
    border-bottom: 2px solid var(--el-color-primary);
  }
  ::v-deep(h1) {
    margin-bottom: 0.75rem;
  }
  ::v-deep(h2) {
    border-left: 4px solid #4f46e4;
    padding-left: 0.75rem;
    margin-bottom: 0.75rem;
    margin-top: 1rem;
    word-break: break-word;
    font-size: 1.25rem;
  }
  ::v-deep(h3) {
    margin-bottom: 0.75rem;
  }
  ::v-deep(h4) {
    margin-bottom: 1rem;
  }
  ::v-deep(h5) {
    margin-bottom: 1rem;
  }
  ::v-deep(ul) {
    margin: 10px 0 10px 15px;
    padding: 0;
  }
  ::v-deep(ol) {
    margin: 10px 0 10px 15px;
    padding: 0;
  }
  ::v-deep(ul > li) {
    list-style: disc;
    margin-left: 1.5rem;
    line-height: 36px;
  }
  ::v-deep(ol > li) {
    list-style: decimal;
    margin-left: 1.5rem;
    line-height: 36px;
  }
  ::v-deep(code) {
    border-radius: 0.25rem;
    background-color: #fff5f5;
    color: #ff502c;
    font-size: 14px;
    padding: 0.1em 0.4em;
    margin: 0 4px;
    font-family: "Cascadia Mono", "Noto Sans SC", sans-serif;
    white-space: break-spaces;
  }
  ::v-deep(blockquote) {
    font-weight: 400;
    background-color: rgba(13, 110, 253, 0.1) !important;
    border-left: 5px solid #0d6efd;
    display: block;
    font-size: 100%;
    line-height: 1.5;
    padding: 1rem !important;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
  }
}
</style>
