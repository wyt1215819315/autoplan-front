<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import More from "@iconify-icons/ep/more-filled";
import WebhookDialog from "@/views/auto/webhook/WebhookDialog.vue";

defineOptions({
  name: "MineWebhookPage"
});
const { loading, columns, dataList, loadingConfig, requestData, dialog, addTask, editTask, delTask, closeDialog } = useColumns();
</script>

<template>
  <div>
    <PureTableBar :title="`我的Webhook列表`" :columns="columns" :simple-mode="true" @refresh="requestData">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="addTask"> 新增 </el-button>
      </template>
      <pure-table
        adaptive
        row-key="id"
        alignWhole="center"
        :size="`default`"
        :loading="loading.main"
        :loading-config="loadingConfig"
        :data="dataList"
        :columns="columns"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      >
        <template #operation="{ row }">
          <el-popconfirm :title="`是否确认删除用户编号为${row.tableNo}的这条数据`" @confirm="delTask(row)">
            <template #reference>
              <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(Delete)"> 删除 </el-button>
            </template>
          </el-popconfirm>
          <el-dropdown>
            <el-button class="ml-3 mt-[2px]" link type="primary" :icon="useRenderIcon(More)" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(EditPen)" @click="editTask(row)"> 测试 </el-button>
                  <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(EditPen)" @click="editTask(row)"> 修改 </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </pure-table>
    </PureTableBar>
    <WebhookDialog :title-prefix="dialog.title" :id="dialog.taskId" :visible="dialog.visible" @close-dialog="closeDialog" />
  </div>
</template>
