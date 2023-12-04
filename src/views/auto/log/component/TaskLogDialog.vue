<template>
  <el-dialog :title="`${props.titlePrefix}任务日志`" v-model="show" fullscreen append-to-body @close="closeDialog">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Consistency" name="1">
        <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
      </el-collapse-item>
    </el-collapse>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="closeDialog"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { watch } from "vue/dist/vue";
import { isAllEmpty } from "@pureadmin/utils";
import { message } from "@/utils/message";
const props = defineProps({
  titlePrefix: String,
  visible: Boolean
});
const emit = defineEmits(["closeDialog"]);
watch(
  () => props.visible,
  async (newValue) => {
    show.value = newValue;
    if (newValue === true) {
      // load log
    } else {
      initForm();
    }
  }
);

const show = ref(false);
const activeNames = ref([]);

function initForm() {
  activeNames.value = [];
}

function closeDialog() {
  emit("closeDialog");
}
</script>
