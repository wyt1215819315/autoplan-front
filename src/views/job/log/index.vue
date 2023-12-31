<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref, watch, onMounted } from "vue";
import { FormInstance } from "element-plus";
import { isAllEmpty } from "@pureadmin/utils";

defineOptions({
  name: "QuartzLog"
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
  form,
  doDelete,
  doDeleteAll,
  view,
  closeDialog
} = useColumns(tableRef);

const windowWidth = ref();
const labelPosition = ref("right");

onMounted(() => {
  window.onresize = () => {
    return (() => {
      windowWidth.value = document.documentElement.clientWidth; // 宽
    })();
  };
});
watch(
  () => windowWidth.value,
  (newValue) => {
    if (!isAllEmpty(newValue)) {
      if (newValue <= 768) {
        // 小屏设备
        labelPosition.value = "top";
        pagination.small = true;
      } else {
        labelPosition.value = "right";
        pagination.small = false;
      }
    }
  }
);
</script>

<template>
  <div>
    <PureTableBar title="定时任务日志管理" :columns="columns" :simple-mode="true" @refresh="requestData">
      <template #buttons>
        <el-button type="danger" :icon="useRenderIcon(Delete)" @click="doDeleteAll"> 清空日志 </el-button>
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
        @row-click="view"
        @page-size-change="onSizeChange"
        @page-current-change="onCurrentChange"
      >
        <template #operation="{ row }">
          <el-popconfirm :title="`是否确认删除编号为${row.tableNo}的这条数据`" @confirm="doDelete(row)">
            <template #reference>
              <el-button class="reset-margin" link type="primary" :loading="loading.delete" :icon="useRenderIcon(Delete)"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </PureTableBar>
    <el-dialog title="日志详情" v-model="dialog.visible" fullscreen append-to-body @close="closeDialog">
      <el-form ref="formDialogRef" :model="form" label-width="15vw" :label-position="labelPosition">
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务名称:" prop="jobName">
              <el-input v-model="form.jobName" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="调用目标字符串:" prop="invokeTarget">
              <el-input v-model="form.invokeTarget" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="日志信息:" prop="jobMessage">
              <el-input type="textarea" v-model="form.jobMessage" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务状态:" prop="status">
              <el-input v-model="form.status" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="异常信息:" prop="exceptionInfo">
              <el-input type="textarea" v-model="form.exceptionInfo" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="开始时间:" prop="startTime">
              <el-input v-model="form.startTime" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="结束时间:" prop="endTime">
              <el-input v-model="form.endTime" readonly />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="dialog.visible = false"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
