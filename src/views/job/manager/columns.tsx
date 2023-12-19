import { delay, getKeyList } from "@pureadmin/utils";
import { ref, onMounted, reactive, Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { changeJobStatus, deleteJob, getJobPage, runJob, saveJob, updateJob, viewJob } from "@/api/job";
// import { isValidCron } from "cron-validator";

class SysQuartzJob {
  id: number;
  jobName: string;
  invokeTarget: string;
  cronExpression: string;
  concurrent: number;
  timeout: number;
  status: number;
}

export function useColumns(tableRef: Ref) {
  const dataList = ref([]);
  const loading = ref({
    main: true,
    addDialogButton: false,
    delete: false
  });
  const hideVal = ref("nohide");

  const dialog = reactive({
    visible: false,
    title: ""
  });
  const cronGenerator = reactive({
    visible: false,
    cron: ""
  });
  // 表单数据
  const dialogForm = ref<SysQuartzJob>();
  // 表单校验规则
  const dialogRules = ref({
    cronExpression: [
      { required: true, message: "请输入Cron表达式", trigger: "blur" }
      // {
      //   validator: (rule, value, callback) => {
      //     // seconds可以通过seconds在选项中将标志传递为 true来启用对秒的支持(例:* * * * * *);
      //     // alias启用alias对月份和工作日的支持(例:* * * * mon);
      //     // allowBlankDay可以启用该标志以使用?符号将天或工作日标记为空白(例:* * * * ?);
      //     // allowSevenAsSunday可以启用该标志以支持数字 7 作为星期日(例:* * * * 7);
      //     const isOk = isValidCron(value, {
      //       seconds: true,
      //       alias: true,
      //       allowBlankDay: true,
      //       allowSevenAsSunday: true
      //     });
      //     if (!isOk) {
      //       callback(new Error("请输入可用的Cron表达式"));
      //     } else {
      //       callback();
      //     }
      //   },
      //   trigger: "blur"
      // }
    ]
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
      minWidth: 120,
      prop: "jobName",
      showOverflowTooltip: true
    },
    {
      label: "cron表达式",
      minWidth: 100,
      prop: "cronExpression",
      showOverflowTooltip: true
    },
    {
      label: "执行超时",
      minWidth: 80,
      prop: "timeout",
      cellRenderer: ({ row }) => <span>{row.timeout + "秒"}</span>
    },
    {
      label: "并发策略",
      minWidth: 80,
      prop: "concurrent",
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type={row.concurrent === 0 ? "danger" : ""} effect="plain">
          {row.concurrent === 0 ? "并发执行" : "非并发执行"}
        </el-tag>
      )
    },
    {
      label: "开关",
      width: 70,
      prop: "status",
      cellRenderer: (scope) => (
        <el-switch
          size="small"
          v-model={scope.row.status}
          active-value={0}
          inactive-value={1}
          active-text="启用"
          inactive-text="暂停"
          inline-prompt
          // disabled={!useUserStoreHook().isAdmin()}
          loading={scope.row.loading}
          onChange={() => doChangeJobStatus(scope.row)}
        />
      )
    },
    {
      label: "操作",
      width: 200,
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
    getJobPage({
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

  function add() {
    initForm();
    dialog.title = "新增定时任务";
    dialogForm.value = {
      concurrent: 0,
      cronExpression: "",
      id: undefined,
      invokeTarget: "",
      jobName: "",
      status: 1,
      timeout: 3600
    };
    dialog.visible = true;
  }

  /**
   * 打开编辑页面
   */
  function edit(row?: any) {
    initForm();
    viewJob(row.id).then((data) => {
      if (data.success) {
        dialog.title = "编辑定时任务";
        dialogForm.value = data.data;
        dialog.visible = true;
      }
    });
  }

  /**
   * 请求后台api进行修改或保存
   */
  async function doSaveOrUpdate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        loading.value.addDialogButton = true;
        let data;
        try {
          if (dialogForm.value.id !== undefined) {
            // update
            data = await updateJob(dialogForm.value);
          } else {
            // insert
            data = await saveJob(dialogForm.value);
          }
          if (data.success) {
            message("操作成功！", { type: "success" });
            closeDialog();
          }
        } finally {
          loading.value.addDialogButton = false;
        }
      }
    });
  }

  function doDelete(row?: any) {
    loading.value.delete = true;
    deleteJob({ ids: [row.id] })
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
    deleteJob({ ids: getKeyList(curSelected, "id") })
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

  function doChangeJobStatus(row: any) {
    row.loading = true;
    changeJobStatus({
      id: row.id,
      status: row.status
    })
      .then((data) => {
        if (data.success) {
          message("修改状态成功！", { type: "success" });
        }
      })
      .finally(() => {
        row.loading = false;
      });
  }

  function doRunJob(row?: any) {
    runJob(row.id).then((data) => {
      if (data.success) {
        message("运行成功", { type: "success" });
      }
    });
  }

  function closeDialog() {
    dialog.visible = false;
  }

  function initForm() {
    dialog.title = "";
    dialogForm.value = new SysQuartzJob();
  }

  function openCronForm() {
    cronGenerator.cron = dialogForm.value.cronExpression;
  }

  function updateCronForm(val: any) {
    if (typeof val !== "string") return false;
    dialogForm.value.cronExpression = val;
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
  };
}
