<script setup lang="ts">
import { useRoute } from "vue-router";
import { isEmpty } from "@pureadmin/utils";
import { useColumns } from "./columns";

defineOptions({
  name: "TaskInfoPage"
});
const route = useRoute();
const parameter = isEmpty(route.params) ? route.query : route.params;
const {
  loading,
  columns,
  dataList,
  hideVal,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange
} = useColumns(parameter);
</script>

<template>
  <div>
    <el-space class="float-right mb-4">
      <p class="text-sm">动态列：</p>
      <el-radio-group v-model="hideVal" size="small">
        <el-radio-button label="nohide">不隐藏</el-radio-button>
        <el-radio-button label="hideDate">隐藏日期</el-radio-button>
        <el-radio-button label="hideName">隐藏姓名</el-radio-button>
        <el-radio-button label="hideAddress">隐藏地址</el-radio-button>
      </el-radio-group>
    </el-space>

    <pure-table
      border
      adaptive
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :size="`default`"
      :loading="loading"
      :loading-config="loadingConfig"
      :data="
        dataList.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    >
      <template #operation="{ row }">
        <el-button type="primary" size="small"> Detail </el-button>
        <el-button type="primary" size="small">Edit</el-button>
      </template>
    </pure-table>
  </div>
</template>
