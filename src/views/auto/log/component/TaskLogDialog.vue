<template>
  <el-dialog :title="`${props.titlePrefix}日志`" v-model="show" fullscreen append-to-body @close="closeDialog">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item, index) in logDisplayData" :key="index" :name="index">
        <template #title>
          <StatusIcon :status="item.style" :size="18" />
          {{ item.taskName }}
        </template>
        <div v-for="(info, infoIndex) in item.dataList" :key="infoIndex" class="task-info-div">
          <StatusIcon :status="getInfoStatus(info)" :size="18" />
          {{ info.data }}
        </div>
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
import { ref, watch } from "vue";
import { isAllEmpty } from "@pureadmin/utils";
import { getNearlyLogByTaskId } from "@/api/auto_log";
import { isJsonString } from "@/utils/oldwu-util";
import StatusIcon from "@/views/auto/log/component/StatusIcon.vue";

class logDisplayDataClass {
  taskName: string;
  style: string;
  dataList: Array<logDisplayDataInfoClass>;
}

class logDisplayDataInfoClass {
  style: string;
  data: string;
}

defineOptions({
  name: "TaskLogDialog"
});

const show = ref(false);
const activeNames = ref([]);
const logDisplayData = ref<Array<logDisplayDataClass>>([]);

const props = defineProps({
  titlePrefix: String,
  visible: Boolean,
  taskId: String
});
const emit = defineEmits(["closeDialog"]);
watch(
  () => props.visible,
  async (newValue) => {
    show.value = newValue;
    if (newValue === true && !isAllEmpty(props.taskId)) {
      // load log
      getNearlyLogByTaskId(props.taskId).then((data) => {
        if (data.success) {
          const text = data.data.text;
          if (isJsonString(text)) {
            const logArray = JSON.parse(text);
            parseLogs(logArray);
          }
        } else {
          closeDialog();
        }
      });
    } else {
      initForm();
    }
  }
);

function parseLogs(logArray: any) {
  // 解析一大堆log数组，并装在到变量中去，这东西比较复杂
  logArray.forEach((logObj: any, index: number) => {
    const style = logObj.style;
    const data = logObj.data;
    if (style === "TASK_START") {
      // 任务开始必有任务结束，遍历后面的数据找到data相同的end
      logArray.forEach((obj2: any, index2: number) => {
        if (obj2.style === "TASK_END" && obj2.data === data && index2 > index) {
          const taskInfoArray = logArray.slice(index + 1, index2);
          const taskStatus = getTaskStatus(taskInfoArray);
          logDisplayData.value.push({
            dataList: handleTaskArray(taskInfoArray),
            style: taskStatus,
            taskName: data
          });
          return;
        }
      });
    }
  });
}

function handleTaskArray(array: Array<any>): Array<any> {
  const notDisplayStyle = ["TASK_ERROR", "TASK_SUCCESS"];
  array = array.filter((obj) => {
    const style = obj.style;
    return !notDisplayStyle.includes(style);
  });
  return array;
}

function getInfoStatus(item: any): string {
  const errorStatus = ["USER_CHECK_ERROR", "USER_INFO_UPDATE_ERROR", "TASK_ERROR"];
  const info = item.style;
  if (errorStatus.includes(info)) {
    return "error";
  } else if (info === "TASK_RESULT") {
    if (item.data.toLowerCase().includes("cannot") || item.data.toLowerCase().includes("error")) {
      return "error";
    } else {
      return "info";
    }
  } else if (item.data.includes("失败")) {
    return "error";
  } else if (info.toLowerCase().includes("warn")) {
    return "warn";
  }
  return "info";
}

function getTaskStatus(array: Array<any>): string {
  let resultStyle = "info";
  // 扫错误
  for (const obj of array) {
    const style = obj.style.toLowerCase();
    if (style === "task_error") {
      return "error";
    }
    if (getInfoStatus(obj) === "error") {
      resultStyle = "warn";
    }
  }
  // 扫警告
  for (const obj of array) {
    const style = obj.style.toLowerCase();
    if (style.includes("warn")) {
      return "warn";
    }
  }
  // 扫成功
  let successFlag = false;
  for (const obj of array) {
    const style = obj.style.toLowerCase();
    if (style.includes("success")) {
      successFlag = true;
    }
  }
  if (successFlag && resultStyle !== "warn") {
    resultStyle = "success";
  }
  return resultStyle;
}

function initForm() {
  activeNames.value = [];
  logDisplayData.value = [];
}

function closeDialog() {
  emit("closeDialog");
}
</script>
<style lang="scss" scoped>
.task-info-div {
  display: flex;
  vertical-align: center;
  align-items: center;
  margin-left: 10px;
}
</style>
