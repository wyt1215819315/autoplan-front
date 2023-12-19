import { delay, getKeyList } from "@pureadmin/utils";
import { ref, onMounted, reactive, Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { deleteJobLog, deleteAllJobLog, getJobLogPage, viewJobLog } from "@/api/job";
import { ElMessageBox } from "element-plus";

class SysQuartzJobLog {
  id: number;
  jobName: string;
  invokeTarget: string;
  jobMessage: string;
  status: number;
  exceptionInfo: string;
  startTime: string;
  endTime: string;
}

export function useColumns(tableRef: Ref) {
  const dataList = ref([]);
  const loading = ref({
    main: true,
    delete: false
  });
  const hideVal = ref("nohide");
  const form = ref<SysQuartzJobLog>();

  const dialog = reactive({
    visible: false
  });

  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true,
      width: 40
    },
    {
      label: "序号",
      width: 60,
      prop: "tableNo"
    },
    {
      label: "名称",
      minWidth: 100,
      prop: "jobName"
    },
    {
      label: "日志信息",
      minWidth: 120,
      prop: "jobMessage",
      showOverflowTooltip: true
    },
    {
      label: "结束时间",
      width: 160,
      prop: "endTime"
    },
    {
      label: "执行结果",
      width: 80,
      prop: "status",
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type={row.status === 1 ? "danger" : row.status === 2 ? "" : "success"} effect="plain">
          {row.status === 1 ? "失败" : row.status === 2 ? "超时" : "正常"}
        </el-tag>
      )
    },
    {
      label: "操作",
      width: 80,
      fixed: "right",
      slot: "operation"
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

  function onSizeChange(val) {
    loadingConfig.text = `正在加载...`;
    pagination.pageSize = val;
    delay(100).then(() => {
      requestData();
    });
  }

  function onCurrentChange(val) {
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
    getJobLogPage({
      size: pagination.pageSize,
      current: pagination.currentPage
    })
      .then((data) => {
        pagination.total = data.data.total;
        dataList.value = [];
        for (let i = 0; i < data.data.records.length; i++) {
          const record = data.data.records[i];
          record.tableNo = (pagination.currentPage - 1) * pagination.pageSize + i + 1;
          dataList.value.push(record);
        }
      })
      .finally(() => {
        loading.value.main = false;
      });
  }

  /**
   * 打开编辑页面
   */
  function view(row?: any) {
    initForm();
    viewJobLog(row.id).then((data) => {
      if (data.success) {
        dialog.visible = true;
        form.value = data.data;
      }
    });
  }

  function doDelete(row?: any) {
    loading.value.delete = true;
    deleteJobLog({ ids: [row.id] })
      .then((data) => {
        if (data.success) {
          message("删除成功！", { type: "success" });
          requestData();
        }
      })
      .finally(() => {
        loading.value.delete = false;
      });
  }

  /** 批量删除 */
  function doBatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    deleteJobLog({ ids: getKeyList(curSelected, "id") })
      .then((data) => {
        if (data.success) {
          message("删除成功！", { type: "success" });
          tableRef.value.getTableRef().clearSelection();
          requestData();
        }
      })
      .finally(() => {
        loading.value.delete = false;
      });
  }

  function doDeleteAll() {
    ElMessageBox.confirm("确认删除后定时任务日志表将会被清空且无法恢复，确定要执行操作吗？", "提示", {
      type: "warning"
    })
      .then(() => {
        deleteAllJobLog().then((data) => {
          if (data.success) {
            message("删除成功", { type: "success" });
            requestData();
          }
        });
      })
      .catch(() => {});
  }

  function closeDialog() {
    dialog.visible = false;
  }

  function initForm() {
    form.value = new SysQuartzJobLog();
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
    form,
    view,
    doDelete,
    doDeleteAll,
    closeDialog
  };
}
