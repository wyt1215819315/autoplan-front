<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import { PureTableBar } from "@/components/RePureTableBar";
import { onMounted, ref, watch } from "vue";
import { FormInstance } from "element-plus";
import { isAllEmpty } from "@pureadmin/utils";

defineOptions({
  name: "AutoIndexManager"
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
  edit,
  doUpdate,
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
    <PureTableBar title="任务管理" :columns="columns" :simple-mode="true" @refresh="requestData">
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
        </template>
      </pure-table>
    </PureTableBar>
    <el-dialog :title="dialog.title" v-model="dialog.visible" fullscreen append-to-body @close="closeDialog">
      <el-form ref="formDialogRef" :model="dialogForm" :rules="dialogRules" label-width="15vw" :label-position="labelPosition">
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务代号:" prop="code">
              <el-input v-model="dialogForm.code" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务名称:" prop="name">
              <el-input v-model="dialogForm.name" placeholder="请输入任务名称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务执行超时:" prop="timeout">
              <el-input type="number" v-model="dialogForm.timeout" placeholder="请输入任务执行超时" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行超时:" prop="timeout">
              <el-input type="number" v-model="dialogForm.timeout" placeholder="请输入任务执行超时，单位（秒）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务间隔:" prop="delay">
              <el-input type="number" v-model="dialogForm.delay" placeholder="请输入任务之间的执行间隔，单位（秒）" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线程数:" prop="threadNum">
              <el-input type="number" v-model="dialogForm.threadNum" placeholder="请输入任务池的并发数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态:" prop="enable">
              <el-switch
                size="default"
                v-model="dialogForm.enable"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
                inline-prompt
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="doUpdate(formDialogRef)" :loading="loading.addDialogButton"> 保存 </el-button>
          <el-button type="danger" @click="closeDialog" :loading="loading.addDialogButton"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
