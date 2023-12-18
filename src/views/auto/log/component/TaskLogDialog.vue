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
      <el-button
        :class="buttonClass"
        link
        type="primary"
        :icon="useRenderIcon(isExpand ? ExpandIcon : UnExpandIcon)"
        @click="toggleRowExpansionAll(!isExpand)"
      >
        {{ isExpand ? "折叠全部" : "展开全部" }}
      </el-button>
      <el-tree :data="logDisplayData" :props="treeProps" ref="treeRef">
        <template #default="{ node, data }">
          <div style="display: flex; align-items: flex-start">
            <span><StatusIcon :status="data.style" :size="18" /></span>
            <span style="white-space: break-spaces">{{ node.label }}</span>
          </div>
        </template>
      </el-tree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="show = false"> 关闭 </el-button>
        </div>
      </template>
    </el-card>
  </el-dialog>
</template>

<script setup lang="tsx">
import { computed, getCurrentInstance, ref, watch } from "vue";
import { isAllEmpty } from "@pureadmin/utils";
import { getNearlyLogByTaskId } from "@/api/auto_log";
import { isJsonString } from "@/utils/oldwu-util";
import { useAutoColumnStoreHook } from "@/store/modules/autoColumn";
import dayjs from "dayjs";
import StatusIcon from "@/views/auto/log/component/StatusIcon.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import ExpandIcon from "@/views/system/user/svg/expand.svg";
import UnExpandIcon from "@/views/system/user/svg/unexpand.svg";

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
const logDisplayData = ref<Array<LogDisplayDataClass>>([]);
const logData = ref<AutoLogData>(new AutoLogData());

const store = useAutoColumnStoreHook();
const props = defineProps({
  titlePrefix: String,
  visible: Boolean,
  taskId: String
});
const emit = defineEmits(["closeDialog"]);
const treeProps = {
  children: "children",
  label: "data"
};
const isExpand = ref(true);
const treeRef = ref();
const { proxy } = getCurrentInstance();
const buttonClass = computed(() => {
  return ["!h-[20px]", "reset-margin", "!text-gray-500", "dark:!text-white", "dark:hover:!text-primary"];
});
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
            logDisplayData.value = Object.assign([], JSON.parse(text));
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

function toggleRowExpansionAll(status) {
  isExpand.value = status;
  const nodes = (proxy.$refs["treeRef"] as any).store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

function initForm() {
  logDisplayData.value = [];
  logData.value = new AutoLogData();
}

function closeDialog() {
  emit("closeDialog");
}
</script>
<style lang="scss" scoped>
:deep(.el-tree-node) {
  white-space: normal;
  outline: 0;
  border-top: 1px solid var(--el-border-color-lighter);

  .el-tree-node__content {
    text-align: left;
    align-items: center;
    padding: 8px;
    height: 100%;
    //border-top: 1px solid var(--el-border-color-lighter);
  }
}

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
