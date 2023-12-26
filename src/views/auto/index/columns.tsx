import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive, Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { changeAutoIndexStatus, getAutoIndexPage, updateAutoIndex } from "@/api/auto_index";
import { AutoIndex } from "@/api/auto";

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
  // 表单数据
  const dialogForm = ref<AutoIndex>();
  // 表单校验规则
  const dialogRules = ref({
    name: [{ required: true, message: "请输入任务名称", trigger: "blur" }]
  });

  const columns: TableColumnList = [
    {
      label: "序号",
      width: 60,
      prop: "tableNo"
    },
    {
      label: "代号",
      minWidth: 120,
      prop: "code",
      showOverflowTooltip: true
    },
    {
      label: "名称",
      minWidth: 120,
      prop: "name",
      showOverflowTooltip: true
    },
    {
      label: "执行超时",
      minWidth: 80,
      prop: "timeout",
      cellRenderer: ({ row }) => <span>{row.timeout + "秒"}</span>
    },
    {
      label: "任务间隔",
      minWidth: 80,
      prop: "delay",
      cellRenderer: ({ row }) => <span>{row.timeout + "秒"}</span>
    },
    {
      label: "线程数",
      width: 80,
      prop: "threadNum"
    },
    {
      label: "状态",
      width: 70,
      prop: "enable",
      cellRenderer: (scope) => (
        <el-switch
          size="small"
          v-model={scope.row.enable}
          active-value={1}
          inactive-value={0}
          active-text="启用"
          inactive-text="禁用"
          inline-prompt
          // disabled={!useUserStoreHook().isAdmin()}
          loading={scope.row.loading}
          onChange={() => doChangeStatus(scope.row)}
        />
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
    getAutoIndexPage({
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
  function edit(row?: any) {
    initForm();
    dialog.title = "编辑";
    dialogForm.value = row;
    dialog.visible = true;
  }

  /**
   * 请求后台api进行修改或保存
   */
  async function doUpdate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        loading.value.addDialogButton = true;
        try {
          const data = await updateAutoIndex(dialogForm.value);
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

  function doChangeStatus(row: any) {
    row.loading = true;
    changeAutoIndexStatus({
      id: row.id,
      enable: row.enable
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

  function closeDialog() {
    dialog.visible = false;
  }

  function initForm() {
    dialog.title = "";
    dialogForm.value = new AutoIndex();
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
    dialogForm,
    dialogRules,
    edit,
    doUpdate,
    closeDialog
  };
}
