<script setup lang="ts">
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { ref, onMounted, nextTick, reactive } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import AddFill from "@iconify-icons/ri/add-circle-line";
import TaskDialog from "@/views/auto/task/TaskDialog.vue";
import { AutoTask, mineTaskPage } from "@/api/auto";
import TaskCard from "@/views/auto/mine/components/TaskCard.vue";
import { PaginationProps } from "@pureadmin/table";
import Refresh from "@iconify-icons/ep/refresh";

defineOptions({
  name: "MineCardList"
});

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

const INITIAL_DATA = {
  name: "",
  status: "",
  description: "",
  type: "",
  mark: ""
};

/** 分页配置 */
const pagination = reactive<PaginationProps>({
  pageSize: 12,
  currentPage: 1,
  pageSizes: [12, 24],
  total: 0,
  align: "center",
  background: true,
  small: false
});

const dataList = ref<Array<AutoTask>>([]);
const dataLoading = ref(true);

const getCardListData = () => {
  mineTaskPage({
    size: pagination.pageSize,
    current: pagination.currentPage
  })
    .then((data) => {
      if (data.success) {
        pagination.total = data.data.total;
        dataList.value = data.data.records;
      }
    })
    .finally(() => {
      dataLoading.value = false;
    });
};

onMounted(() => {
  getCardListData();
});

const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const searchValue = ref("");

const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
};
const onCurrentChange = (current: number) => {
  pagination.currentPage = current;
};
const handleDeleteItem = (product) => {};

function closeDialog() {
  formDialogVisible.value = false;
  getCardListData();
}

const handleEditProduct = (product) => {
  formDialogVisible.value = true;
  nextTick(() => {
    formData.value = { ...product, status: product?.isSetup ? "1" : "0" };
  });
};
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <div>
        <el-button :icon="useRenderIcon(AddFill)" @click="formDialogVisible = true"> 新建任务 </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="getCardListData"> 刷新列表 </el-button>
      </div>
      <el-input style="width: 300px" v-model="searchValue" placeholder="请输入任务名称" clearable>
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline v-show="searchValue.length === 0" :icon="Search" />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div v-loading="dataLoading" :element-loading-svg="svg" element-loading-svg-view-box="-10, -10, 50, 50">
      <el-empty description="暂无数据" v-show="dataList.length === 0" />
      <template v-if="pagination.total > 0">
        <el-row>
          <el-col v-for="(item, index) of dataList" :key="index" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
            <TaskCard :item="item" @delete="handleDeleteItem" @manage="handleEditProduct" @refresh="getCardListData" />
          </el-col>
        </el-row>
        <el-pagination
          class="float-right"
          v-model:currentPage="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="pagination.pageSizes"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </template>
    </div>
    <TaskDialog :title-prefix="`新增`" :visible="formDialogVisible" @close-dialog="closeDialog" />
  </div>
</template>
