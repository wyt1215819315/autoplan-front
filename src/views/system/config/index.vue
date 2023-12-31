<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { ref } from "vue";
import { FormInstance } from "element-plus";

defineOptions({
  name: "SystemConfigPage"
});
const formDialogRef = ref<FormInstance>();
const tableRef = ref();
const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange,
  requestData,
  dialog,
  dialogForm,
  dialogRules,
  add,
  edit,
  doSaveOrUpdate,
  doDelete,
  closeDialog
} = useColumns(tableRef);
</script>

<template>
  <div>
    <PureTableBar title="系统配置管理" :columns="columns" :simple-mode="true" @refresh="requestData">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="add"> 新增配置 </el-button>
      </template>
      <pure-table
        adaptive
        row-key="id"
        alignWhole="center"
        ref="tableRef"
        :size="`default`"
        :loading="loading.main"
        :loading-config="loadingConfig"
        :data="dataList"
        :columns="columns"
        :pagination="pagination"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
        @page-size-change="onSizeChange"
        @page-current-change="onCurrentChange"
      >
        <template #operation="{ row }">
          <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(EditPen)" @click="edit(row)"> 修改 </el-button>
          <el-popconfirm :title="`是否确认删除编号为${row.tableNo}的这条数据`" @confirm="doDelete(row)">
            <template #reference>
              <el-button class="reset-margin" link type="primary" :loading="loading.delete" :icon="useRenderIcon(Delete)"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </PureTableBar>
    <el-dialog :title="dialog.title" v-model="dialog.visible" fullscreen append-to-body @close="closeDialog">
      <el-form ref="formDialogRef" :model="dialogForm" :rules="dialogRules" label-width="15vw">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="dialogForm.name" placeholder="输入中文键值解释" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="键（Key）:" prop="key">
              <el-input v-model="dialogForm.key" placeholder="请输入Key" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="值（Value）:" prop="value">
              <el-input type="textarea" size="large" v-model="dialogForm.value" placeholder="请输入Value" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea" v-model="dialogForm.remark" placeholder="输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="doSaveOrUpdate(formDialogRef)" :loading="loading.addDialogButton"> 保存 </el-button>
          <el-button type="danger" @click="closeDialog" :loading="loading.addDialogButton"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
