<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { isAllEmpty, isEmpty } from "@pureadmin/utils";
import { useRoute } from "vue-router";
import More from "@iconify-icons/ep/more-filled";
import TaskDialog from "@/views/auto/task/TaskDialog.vue";
import Info from "@iconify-icons/ri/information-line";
import TaskLogDialog from "@/views/auto/log/component/TaskLogDialog.vue";
import { ref, watch, onMounted } from "vue";

defineOptions({
  name: "TaskInfoPage"
});
const route = useRoute();
const parameter = isEmpty(route.params) ? route.query : route.params;
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
  taskLogDialog,
  tableTitle,
  addTask,
  editTask,
  delTask,
  showLog,
  closeLogDialog,
  closeDialog
} = useColumns(parameter);

const windowWidth = ref();

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
      pagination.small = newValue <= 768;
    }
  }
);
</script>

<template>
  <div>
    <PureTableBar :title="`${tableTitle}任务列表`" :columns="columns" :simple-mode="true" @refresh="requestData">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="addTask"> 新增自动任务 </el-button>
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
        :pagination="pagination"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
        @page-size-change="onSizeChange"
        @page-current-change="onCurrentChange"
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
                  <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(EditPen)" @click="editTask(row)"> 修改 </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button class="reset-margin" link type="primary" :icon="useRenderIcon(Info)" @click="showLog(row)"> 日志 </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </pure-table>
    </PureTableBar>
    <TaskDialog
      :title-prefix="dialog.title"
      :index-id="parameter.id"
      :task-id="dialog.taskId"
      :visible="dialog.visible"
      @close-dialog="closeDialog"
    />
    <TaskLogDialog
      :title-prefix="taskLogDialog.title"
      :visible="taskLogDialog.visible"
      :task-id="taskLogDialog.taskId"
      @close-dialog="closeLogDialog"
    />
  </div>
</template>
