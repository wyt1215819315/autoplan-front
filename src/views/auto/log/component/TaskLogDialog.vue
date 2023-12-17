<template>
  <el-dialog :title="`${props.titlePrefix}日志`" v-model="show" fullscreen append-to-body @close="closeDialog">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="run-time">
            最后运行于 {{ logData.date }}
            <span style="color: var(--el-color-warning)" v-if="logData.notToday">(非今日)</span>
          </span>
          <el-tag :type="store.getStatusDisplayType(logData.status)" effect="plain" size="large">
            {{ store.getStatusContent(logData.status) }}
          </el-tag>
        </div>
      </template>
      <el-collapse v-model="activeNames">
        <template v-for="(item, index) in logDisplayData" :key="index">
          <TaskLogCollapseTree :item="item" :index="index" :depth="1" />
        </template>
      </el-collapse>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="closeDialog"> 关闭 </el-button>
        </div>
      </template>
    </el-card>
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref, watch } from "vue";
import { isAllEmpty } from "@pureadmin/utils";
import { getNearlyLogByTaskId } from "@/api/auto_log";
import { isJsonString } from "@/utils/oldwu-util";
import { useAutoColumnStoreHook } from "@/store/modules/autoColumn";
import dayjs from "dayjs";
import TaskLogCollapseTree from "@/views/auto/log/component/TaskLogCollapseTree.vue";

class AutoLogData {
  status: number;
  date: string;
  type: string;
  notToday: boolean;
}

class LogDisplayDataClass {
  style: string;
  data: string;
  children: Array<LogDisplayDataClass>;
}

defineOptions({
  name: "TaskLogDialog"
});

const show = ref(false);
const activeNames = ref([]);
const logDisplayData = ref<Array<LogDisplayDataClass>>([]);
const logData = ref<AutoLogData>(new AutoLogData());

const store = useAutoColumnStoreHook();
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
          logData.value.status = data.data.status;
          const jsDate = dayjs(data.data.date, { format: "YYYY-MM-DD HH:mm:ss" });
          const currentDate = dayjs();
          logData.value.notToday = !jsDate.isSame(currentDate, "day");
          logData.value.date = data.data.date;
          logData.value.type = data.data.type;
          const text = data.data.text;
          if (isJsonString(text)) {
            logDisplayData.value = Object.assign(new LogDisplayDataClass(), JSON.parse(text));
            console.log(logDisplayData);
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

function initForm() {
  activeNames.value = [];
  logDisplayData.value = [];
  logData.value = new AutoLogData();
}

function closeDialog() {
  emit("closeDialog");
}
</script>
<style lang="scss" scoped>
.task-info-div {
  display: flex;
  align-items: flex-start;
  margin-left: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;

  .run-time {
    white-space: nowrap;
    overflow: hidden;
    font-weight: bold;
    font-size: 16px;
  }
}

.box-card {
  :deep(.el-card__header) {
    padding: 14px 16px;
  }
}
</style>
