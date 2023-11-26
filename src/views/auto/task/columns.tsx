import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { AutoIndex, deleteTask, getTaskPage } from "@/api/auto";
import { useUserStoreHook } from "@/store/modules/user";
import { useAutoColumnStoreHook } from "@/store/modules/autoColumn";
import { message } from "@/utils/message";

export function useColumns(parameter) {
  const dataList = ref([]);
  const loading = ref({
    main: true
  });
  const select = ref(true);
  const hideVal = ref("nohide");

  const indexInfo = ref<AutoIndex>();
  const tableTitle = ref("自动任务列表");
  const indexId = parameter.id;

  const dialog = reactive({
    visible: false,
    title: "",
    taskId: undefined
  });

  const autoStore = useAutoColumnStoreHook();

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
      width: 100,
      prop: "enable",
      cellRenderer: (scope) => (
        <el-switch
          size="small"
          // loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enable}
          active-value={1}
          inactive-value={0}
          active-text="启用"
          inactive-text="停用"
          inline-prompt
          disabled={!useUserStoreHook().isAdmin()}
          // onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "任务状态",
      width: 120,
      prop: "lastEndStatus",
      cellRenderer: (scope) => {
        return (
          <el-tag size="small" type={autoStore.getStatusDisplayType(scope.row.lastEndStatus)}>
            {autoStore.getStatusContent(scope.row.lastEndStatus)}
          </el-tag>
        );
      }
    },
    {
      label: "任务完成时间",
      width: 160,
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

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 15,
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

  function loadIndexInfo() {
    if (!useAutoColumnStoreHook().getIdDataMap.has(indexId)) {
      message("获取任务表单失败，请刷新页面重试！", { type: "error" });
      return;
    } else {
      const data = useAutoColumnStoreHook().getIdDataMap.get(indexId);
      indexInfo.value = data.index;
      tableTitle.value = indexInfo.value.name;
      for (const col of data.display) {
        columns.push({
          label: col.name,
          prop: "userInfo." + col.field,
          showOverflowTooltip: true
        });
      }
    }
  }

  loadIndexInfo();

  function onSizeChange(val: any) {
    loadingConfig.text = `正在加载...`;
    pagination.pageSize = val;
    delay(100).then(() => {
      requestData();
    });
  }

  function onCurrentChange(val: any) {
    loadingConfig.text = `正在加载第${val}页...`;
    delay(100).then(() => {
      requestData();
    });
  }

  onMounted(() => {
    delay(100).then(() => {
      requestData();
    });
  });

  function requestData() {
    loading.value.main = true;
    getTaskPage(parameter.id, {
      size: pagination.pageSize,
      current: pagination.currentPage
    })
      .then((data) => {
        pagination.total = data.data.total;
        dataList.value = [];
        for (let i = 0; i < data.data.records.length; i++) {
          const record = data.data.records[i];
          record.tableNo = (pagination.currentPage - 1) * pagination.pageSize + i + 1;
          // 解析settings json字符串到列表中去
          dataList.value.push(record);
        }
      })
      .finally(() => {
        loading.value.main = false;
      });
  }

  function addTask() {
    dialog.title = "新增";
    dialog.visible = true;
  }

  function editTask(row) {
    dialog.taskId = row.id;
    dialog.title = "编辑";
    dialog.visible = true;
  }

  function delTask(row) {
    loading.value.main = true;
    deleteTask(row.id)
      .then((data) => {
        if (data.success) {
          message("删除成功！", { type: "success" });
          requestData();
        }
      })
      .finally(() => {
        loading.value.main = false;
      });
  }

  function closeDialog() {
    dialog.visible = false;
    dialog.title = "";
    dialog.taskId = undefined;
    requestData();
  }

  return {
    loading,
    columns,
    dataList,
    hideVal,
    pagination,
    loadingConfig,
    onSizeChange,
    onCurrentChange,
    requestData,
    dialog,
    tableTitle,
    addTask,
    editTask,
    delTask,
    closeDialog
  };
}
