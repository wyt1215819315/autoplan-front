<script setup lang="ts">
import Edit from "@iconify-icons/ep/edit";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import VideoPlay from "@iconify-icons/ep/video-play";
import Info from "@iconify-icons/ri/information-line";
import { AutoTask, deleteTask, runTask } from "@/api/auto";
import { isAllEmpty } from "@pureadmin/utils";
import { useAutoColumnStoreHook } from "@/store/modules/autoColumn";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

defineOptions({
  name: "ReCard"
});

const props = defineProps({
  item: {
    require: true,
    type: Object as () => AutoTask
  }
});
const emit = defineEmits(["edit", "refresh"]);
const store = useAutoColumnStoreHook();

function edit() {
  emit("edit", props.item);
}
function refresh() {
  emit("refresh");
}

function handleDelete() {
  ElMessageBox.confirm(`${props.item.name}任务将被删除且无法恢复，是否继续操作？`, "提示", {
    type: "warning"
  })
    .then(() => {
      deleteTask(props.item.id).then((data) => {
        if (data.success) {
          message("删除成功", { type: "success" });
          refresh();
        }
      });
    })
    .catch(() => {});
}

function handleRun() {
  ElMessageBox.confirm(`确定要单次执行${props.item.name}任务吗？`, "提示", {
    type: "warning"
  })
    .then(() => {
      runTask(props.item.id).then((data) => {
        if (data.success) {
          message(data.data.msg, { type: data.data.success ? "success" : "error" });
        }
      });
    })
    .catch(() => {});
}

function getTaskIconBase64() {
  const icon = store.getIdDataMap.get(props.item.indexId).icon;
  if (!isAllEmpty(icon)) {
    return "data:image/png;base64," + icon;
  }
  return null;
}
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-avatar v-show="getTaskIconBase64 != null" shape="square" :size="30" :src="`${getTaskIconBase64()}`" />
        <span>{{ props.item.name }}</span>
        <span class="run-time"> {{ isAllEmpty(props.item.lastEndTime) ? "" : `运行于：${props.item.lastEndTime}` }} </span>
        <el-tag effect="plain" :type="props.item.enable === 1 ? '' : 'danger'" size="small">{{ props.item.enable === 1 ? "开启" : "关闭" }}</el-tag>
      </div>
    </template>
    <el-avatar
      style="float: right"
      shape="circle"
      v-show="!isAllEmpty(props.item.userInfo['headImg'])"
      :size="60"
      :src="props.item.userInfo['headImg']"
    />
    <div class="card-main">
      <div v-for="(value, key, index) in props.item.userInfo" :key="index" class="text item">
        {{ store.getColumnName(props.item.code, key) }} :
        {{ value }}
      </div>
    </div>
    <div>
      <el-tag :type="store.getStatusDisplayType(props.item.lastEndStatus)" effect="plain" size="large" round>
        {{ store.getStatusContent(props.item.lastEndStatus) }}
      </el-tag>
      <div style="float: right">
        <el-button-group class="ml-4">
          <el-tooltip content="日志" placement="top"><el-button type="info" :icon="useRenderIcon(Info)" circle /></el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" :icon="useRenderIcon(Edit)" circle @click="edit" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" :icon="useRenderIcon(Delete)" circle @click="handleDelete" />
          </el-tooltip>
          <el-tooltip content="运行" placement="top">
            <el-button type="warning" :icon="useRenderIcon(VideoPlay)" circle @click="handleRun" />
          </el-tooltip>
        </el-button-group>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.box-card {
  min-width: 300px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  margin-right: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  :deep(.el-card__header) {
    padding: 10px 12px;
  }
  :deep(.el-card__body) {
    padding: 14px 16px;
  }
}

.text {
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;

  span {
    white-space: nowrap;
    overflow: hidden;
  }

  .run-time {
    color: #b4b4b4;
    font-size: 14px;
  }
}

.card-main {
  max-height: 300px;
  overflow: hidden;
}

.item {
  margin-bottom: 16px;
}

.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 32px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      font-size: 32px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
