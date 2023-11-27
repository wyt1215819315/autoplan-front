import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive, Ref } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { deleteSystemConfig, getSystemConfigPage, saveSystemConfig, updateSystemConfig, updateSystemConfigValue } from "@/api/system";

export class SysConfig {
  id: number;
  key: string;
  value: string;
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
  // 表单数据
  const dialogForm = ref<SysConfig>();
  // 表单校验规则
  const dialogRules = ref({
    key: [
      { required: true, message: "请输入键（Key）", trigger: "blur" },
      { max: 200, message: "键不能超过200字", trigger: "blur" }
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
      label: "键（Key）",
      minWidth: 120,
      prop: "key"
    },
    {
      label: "值（Value）",
      minWidth: 150,
      prop: "value",
      showOverflowTooltip: true,
      cellRenderer: (scope) => (
        <div>
          <el-switch
            v-if={scope.row.value == "false" || scope.row.value == "true"}
            size="default"
            v-model={scope.row.value}
            active-value={"true"}
            inactive-value={"false"}
            active-text="真"
            inactive-text="假"
            inline-prompt
            loading={scope.row.loading}
            onChange={() => doChangeValue(scope.row)}
          />
          <span v-else>{scope.row.value}</span>
        </div>
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
    getSystemConfigPage({
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
    dialog.visible = true;
  }

  /**
   * 打开编辑页面
   */
  function edit(row?: any) {
    initForm();
    dialog.title = "编辑定时任务";
    dialogForm.value = row;
    dialog.visible = true;
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
            data = await updateSystemConfig(dialogForm.value);
          } else {
            // insert
            data = await saveSystemConfig(dialogForm.value);
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
    deleteSystemConfig(row.id)
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

  function doChangeValue(row: any) {
    row.loading = true;
    updateSystemConfigValue({
      id: row.id,
      value: row.value
    })
      .then((data) => {
        if (data.success) {
          message("修改成功！", { type: "success" });
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
    dialogForm.value = new SysConfig();
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
    add,
    edit,
    doSaveOrUpdate,
    doDelete,
    closeDialog
  };
}
