<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { onMounted, ref, watch } from "vue";
import { FormInstance } from "element-plus";
import VideoPlay from "@iconify-icons/ep/video-play";
import { cron } from "@/components/crontab";
import { isAllEmpty } from "@pureadmin/utils";

defineOptions({
  name: "QuartzManager"
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
  cronGenerator,
  openCronForm,
  updateCronForm,
  dialog,
  dialogForm,
  dialogRules,
  add,
  edit,
  doSaveOrUpdate,
  doDelete,
  doRunJob,
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
    <PureTableBar title="定时任务管理" :columns="columns" :simple-mode="true" @refresh="requestData">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="add"> 新增任务 </el-button>
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
          <el-popconfirm :title="`是否单次运行[${row.jobName}]任务`" @confirm="doRunJob(row)">
            <template #reference>
              <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(VideoPlay)"> 运行 </el-button>
            </template>
          </el-popconfirm>
          <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(EditPen)" @click="edit(row)"> 修改 </el-button>
          <el-popconfirm :title="`是否确认删除[${row.jobName}]任务`" @confirm="doDelete(row)">
            <template #reference>
              <el-button class="reset-margin" link type="primary" :loading="loading.delete" :icon="useRenderIcon(Delete)"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </PureTableBar>
    <el-dialog :title="dialog.title" v-model="dialog.visible" fullscreen append-to-body @close="closeDialog">
      <el-form ref="formDialogRef" :model="dialogForm" :rules="dialogRules" label-width="15vw" :label-position="labelPosition">
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务名称:" prop="jobName">
              <el-input v-model="dialogForm.jobName" placeholder="请输入任务名称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="调用目标字符串:" prop="invokeTarget">
              <el-input v-model="dialogForm.invokeTarget" placeholder="请输入调用目标字符串" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="cron执行表达式:" prop="cronExpression">
              <el-popover placement="bottom" width="95vw" trigger="click" @show="openCronForm">
                <cron :enable-i18n="false" :show-bottom="false" :cron-value="cronGenerator.cron" @change="updateCronForm" />
                <template #reference>
                  <el-input v-model="dialogForm.cronExpression" placeholder="请输入cron执行表达式" readonly />
                </template>
              </el-popover>
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
            <el-form-item label="是否并发执行:" prop="concurrent">
              <el-switch
                size="default"
                v-model="dialogForm.concurrent"
                :active-value="0"
                :inactive-value="1"
                active-text="允许"
                inactive-text="禁止"
                inline-prompt
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态:" prop="status">
              <el-switch
                size="default"
                v-model="dialogForm.status"
                :active-value="0"
                :inactive-value="1"
                active-text="启用"
                inactive-text="暂停"
                inline-prompt
              />
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
      <!--      <el-dialog title="CRON表达式生成" v-model="cronGenerator.visible" fullscreen append-to-body>-->
      <!--        <cron :enable-i18n="false" :cron-value="cronGenerator.cron" @change="updateCronForm" @close="cronGenerator.visible = false" />-->
      <!--      </el-dialog>-->
    </el-dialog>
  </div>
</template>
