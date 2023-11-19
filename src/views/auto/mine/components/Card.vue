<script setup lang="ts">
import Edit from "@iconify-icons/ep/edit";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import VideoPlay from "@iconify-icons/ep/video-play";
import Info from "@iconify-icons/ri/information-line";

defineOptions({
  name: "ReCard"
});
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-avatar shape="square" :size="30" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
        <span>我的XXXXXXXX任务</span>
        <span class="run-time"> 运行于：04月25日 08:35 </span>
        <el-tag effect="dark" type="" size="small">开启</el-tag>
      </div>
    </template>
    <el-avatar
      style="float: right"
      shape="circle"
      :size="60"
      src="https://img-static.mihoyo.com/communityweb/upload/99e5d22600af87fe08cd21632a0ac191.png"
    />
    <div class="card-main">
      <div v-for="o in 8" :key="o" class="text item">{{ "List item " + o }}</div>
    </div>
    <div>
      <el-tag type="danger" effect="dark" size="large" round>身份信息校验失败</el-tag>
      <div style="float: right">
        <el-button-group class="ml-4">
          <el-tooltip content="日志" placement="top"><el-button type="info" :icon="useRenderIcon(Info)" circle /></el-tooltip>
          <el-tooltip content="编辑" placement="top"><el-button type="primary" :icon="useRenderIcon(Edit)" circle /></el-tooltip>
          <el-tooltip content="删除" placement="top"><el-button type="danger" :icon="useRenderIcon(Delete)" circle /></el-tooltip>
          <el-tooltip content="运行" placement="top"><el-button type="warning" :icon="useRenderIcon(VideoPlay)" circle /></el-tooltip>
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
  margin-bottom: 18px;
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
