<script setup lang="ts">
import { useColumns } from "./columns";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import { PureTableBar } from "@/components/RePureTableBar";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { isEmpty } from "@pureadmin/utils";
import { useRoute } from "vue-router";
import More from "@iconify-icons/ep/more-filled";

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
  dialogForm,
  dialogRules,
  dialogColumn,
  tableTitle,
  indexInfo,
  addTask,
  closeDialog
} = useColumns(parameter);
</script>

<template>
  <div>
    <PureTableBar
      :title="`${tableTitle}任务列表`"
      :columns="columns"
      :simple-mode="true"
      @refresh="requestData"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="addTask"
        >
          新增自动任务
        </el-button>
      </template>
      <pure-table
        adaptive
        row-key="id"
        alignWhole="center"
        :size="`default`"
        :loading="loading"
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
          <el-popconfirm
            :title="`是否确认删除用户编号为${row.id}的这条数据`"
            @confirm=""
          >
            <template #reference>
              <el-button
                class="reset-margin"
                link
                type="primary"
                :icon="useRenderIcon(Delete)"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
          <el-dropdown>
            <el-button
              class="ml-3 mt-[2px]"
              link
              type="primary"
              :icon="useRenderIcon(More)"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :icon="useRenderIcon(EditPen)"
                    @click=""
                  >
                    修改
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </pure-table>
    </PureTableBar>
    <el-dialog
      ref="formDialogRef"
      :title="dialog.title"
      v-model="dialog.visible"
      fullscreen
      append-to-body
      @close="closeDialog"
    >
      <el-form
        :model="dialogForm"
        :rules="dialogRules"
        ref="userFormRef"
        label-width="15vw"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              v-if="dialogForm.userId == undefined"
              label="任务名称"
              prop="userName"
            >
              <el-input
                v-model="dialogForm.userName"
                placeholder="请输入任务名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 动态表单渲染-->
        <el-row v-for="(item, index) in dialogColumn" :key="index">
          <el-col :span="24">
            <el-form-item :label="item.name" :prop="item.field">
              <!-- 普通文本输入框-->
              <el-input
                v-if="item.fieldType === 'String'"
                v-model="dialogForm[item.field]"
                :placeholder="`请输入${item.name}`"
              />
              <!-- 长文本输入框-->
              <el-input
                v-if="item.fieldType === 'TextArea'"
                v-model="dialogForm[item.field]"
                type="textarea"
                :placeholder="`请输入${item.name}`"
              />
              <!-- 数字输入框-->
              <el-input
                v-if="
                  (item.fieldType === 'Integer' ||
                    item.fieldType === 'Long' ||
                    item.fieldType === 'Double') &&
                  item.options === undefined
                "
                type="number"
                v-model="dialogForm[item.field]"
                :placeholder="`请输入${item.name}`"
              />
              <!-- 选择框-->
              <el-select
                v-if="item.options !== undefined"
                v-model="dialogForm[item.field]"
                :placeholder="`请选择${item.name}`"
                style="width: 100%"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.name"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="success" @click=""> 校验 </el-button>
          <el-button type="primary" @click=""> 校验并提交 </el-button>
          <el-button type="danger" @click="closeDialog"> 关闭 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
