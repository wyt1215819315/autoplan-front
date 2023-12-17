<template>
  <IconifyIconOffline v-if="icon === 'success'" :icon="Success" :style="{ fontSize: `${fontSize}px` }" class="success-icon" />
  <IconifyIconOffline v-else-if="icon === 'info'" :icon="InfoFilled" :style="{ fontSize: `${fontSize}px` }" class="grey-icon" />
  <IconifyIconOffline v-else-if="icon === 'error'" :icon="Error" :style="{ fontSize: `${fontSize}px` }" class="error-icon" />
  <IconifyIconOffline v-else-if="icon === 'warn'" :icon="Warning" :style="{ fontSize: `${fontSize}px` }" class="warn-icon" />
  <IconifyIconOffline v-else :icon="QuestionFilled" :style="{ fontSize: `${fontSize}px` }" class="grey-icon" />
</template>

<script setup lang="ts">
import Success from "@iconify-icons/ep/success-filled";
import { ref, watch } from "vue";
import { isAllEmpty } from "@pureadmin/utils";
import QuestionFilled from "@iconify-icons/ep/question-filled";
import InfoFilled from "@iconify-icons/ep/info-filled";
import Error from "@iconify-icons/ep/circle-close-filled";
import Warning from "@iconify-icons/ep/warning-filled";

defineOptions({
  name: "StatusIcon"
});
const icon = ref();
const fontSize = ref(16);

const props = defineProps({
  status: String,
  size: Number
});

watch(
  () => props.status,
  async (newValue) => {
    if (!isAllEmpty(newValue)) {
      icon.value = newValue;
      icon.value = icon.value.toLowerCase();
    }
  },
  { immediate: true }
);
watch(
  () => props.size,
  async (newValue) => {
    if (!isAllEmpty(newValue)) {
      fontSize.value = newValue;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.success-icon {
  margin-right: 5px;
  color: var(--el-color-success);
}
.error-icon {
  margin-right: 5px;
  color: var(--el-color-error);
}
.warn-icon {
  margin-right: 5px;
  color: var(--el-color-warning);
}
.grey-icon {
  margin-right: 5px;
  color: var(--el-color-info);
}
</style>
