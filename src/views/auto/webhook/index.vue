<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import WebhookDialog from "@/views/auto/webhook/WebhookDialog.vue";

defineOptions({
  name: "MineWebhookPage"
});
const { loading, columns, dataList, loadingConfig, requestData, dialog, add, edit, del, closeDialog } = useColumns();
</script>

<template>
  <div>
    <PureTableBar :title="`我的Webhook列表`" :columns="columns" :simple-mode="true" @refresh="requestData">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="add"> 新增 </el-button>
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
          <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(EditPen)" @click="edit(row)"> 修改 </el-button>
          <el-popconfirm :title="`是否确认删除名称为${row.name}的这条数据`" @confirm="del(row)">
            <template #reference>
              <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(Delete)"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </PureTableBar>
    <WebhookDialog :title-prefix="dialog.title" :id="dialog.id" :visible="dialog.visible" @close-dialog="closeDialog" />
  </div>
</template>
