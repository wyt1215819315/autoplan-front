import { clone, delay } from "@pureadmin/utils";
import { ref, onMounted, reactive, watchEffect } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { getTaskPage, getUserInfoColumn } from "@/api/auto";
import { useUserStoreHook } from "@/store/modules/user";

export function useColumns(parameter) {
  const dataList = ref([]);
  const loading = ref(true);
  const select = ref(true);
  const hideVal = ref("nohide");

  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true,
      width: 40,
      hide: () => select.value
    },
    {
      label: "序号",
      width: 60,
      prop: "tableNo"
    },
    {
      label: "开关",
      width: 60,
      prop: "enable"
    },
    {
      label: "任务状态",
      width: 120,
      prop: "lastEndStatus"
    },
    {
      label: "任务完成时间",
      width: 200,
      prop: "lastEndTime"
    },
    {
      label: "操作",
      width: 120,
      fixed: "right",
      slot: "operation",
      hide: !useUserStoreHook().isAdmin()
    }
  ];

  // 动态获取表单列
  getUserInfoColumn(parameter.id).then(data => {
    if (data.success) {
      for (const col of data.data) {
        columns.push({
          label: col.name,
          prop: col.field
        });
      }
    }
  });

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 15, 20],
    total: 0,
    align: "center",
    background: true,
    small: false
  });

  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
  });

  function onSizeChange(val) {
    loadingConfig.text = `正在加载...`;
    pagination.pageSize = val;
    loading.value = true;
    delay(600).then(() => {
      requestData();
    });
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    delay(600).then(() => {
      requestData();
    });
  }

  onMounted(() => {
    delay(600).then(() => {
      requestData();
    });
  });

  function requestData() {
    getTaskPage(parameter.id, {
      size: pagination.pageSize,
      current: pagination.currentPage
    })
      .then(data => {
        pagination.total = data.data.total;
        dataList.value = [];
        for (let i = 0; i < data.data.records.length; i++) {
          const record = data.data.records[i];
          record.table_no =
            pagination.currentPage * pagination.pageSize + i + 1;
          // 解析settings json字符串到列表中去
          dataList.value.push(record);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  return {
    loading,
    columns,
    dataList,
    hideVal,
    pagination,
    loadingConfig,
    onSizeChange,
    onCurrentChange
  };
}
