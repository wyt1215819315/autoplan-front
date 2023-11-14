import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import {
  checkAndSaveTask,
  checkTask,
  getIndexInfo,
  getSettingColumn,
  getTaskPage,
  getUserInfoColumn
} from "@/api/auto";
import { useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";

class AutoIndex {
  id: number;
  name: string;
  code: string;
  icon: string;
}

export function useColumns(parameter) {
  const dataList = ref([]);
  const loading = ref({
    main: true,
    addTaskButton: false
  });
  const select = ref(true);
  const hideVal = ref("nohide");

  const indexInfo = ref<AutoIndex>();
  const tableTitle = ref("自动任务列表");
  const indexId = parameter.id;

  const dialog = reactive({
    visible: false,
    title: ""
  });
  // 表单数据
  const dialogForm = ref({
    _sys: {
      name: "",
      enable: 1,
      code: ""
    },
    data: {}
  });
  // 表单渲染字段
  const dialogColumn = ref([]);
  // 表单校验规则
  const dialogRules = ref({});

  loadIndexInfo();

  function loadIndexInfo() {
    getIndexInfo(indexId).then(data => {
      indexInfo.value = data.data;
      tableTitle.value = indexInfo.value.name;
    });
  }

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
      cellRenderer: scope => (
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
      prop: "lastEndStatus"
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

  // 动态获取表单列
  getUserInfoColumn(parameter.id).then(data => {
    if (data.success) {
      for (const col of data.data) {
        columns.push({
          label: col.name,
          prop: "userInfo." + col.field
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
    delay(600).then(() => {
      requestData();
    });
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
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
    loading.value.main = true;
    getTaskPage(parameter.id, {
      size: pagination.pageSize,
      current: pagination.currentPage
    })
      .then(data => {
        pagination.total = data.data.total;
        dataList.value = [];
        for (let i = 0; i < data.data.records.length; i++) {
          const record = data.data.records[i];
          record.tableNo = pagination.currentPage * pagination.pageSize + i + 1;
          // 解析settings json字符串到列表中去
          dataList.value.push(record);
        }
      })
      .finally(() => {
        loading.value.main = false;
      });
  }

  function addTask() {
    initForm();
    dialog.title = "新增" + indexInfo.value.name + "任务";
    getSettingColumn(indexId).then(data => {
      if (data.success) {
        dialog.visible = true;
        for (const item of data.data) {
          dialogColumn.value.push({
            ...item
          });
          // 填充默认值
          if (item.defaultValue !== undefined) {
            if (
              item.fieldType === "Integer" ||
              item.fieldType === "Long" ||
              item.fieldType === "Double"
            ) {
              dialogForm.value.data[item.field] = Number(item.defaultValue);
            } else {
              dialogForm.value.data[item.field] = item.defaultValue;
            }
          }
        }
      }
    });
  }

  async function doCheckTask(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(valid => {
      if (valid) {
        loading.value.addTaskButton = true;
        checkTask(indexId, dialogForm.value)
          .then(data => {
            if (data.data.success) {
              message(data.data.msg, {
                type: "success"
              });
            } else {
              message(data.data.msg, {
                type: "error",
                dangerouslyUseHTMLString: true,
                duration: 10 * 1000
              });
            }
          })
          .finally(() => {
            loading.value.addTaskButton = false;
          });
      }
    });
  }

  async function doCheckAndSaveTask(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(valid => {
      if (valid) {
        loading.value.addTaskButton = true;
        checkAndSaveTask(indexId, dialogForm.value)
          .then(data => {
            if (data.data.success) {
              message(data.data.msg, {
                type: "success"
              });
              closeDialog();
              requestData();
            } else {
              message(data.data.msg, {
                type: "error",
                dangerouslyUseHTMLString: true,
                duration: 10 * 1000
              });
            }
          })
          .finally(() => {
            loading.value.addTaskButton = false;
          });
      }
    });
  }

  function closeDialog() {
    dialog.visible = false;
  }

  function initForm() {
    dialog.title = "";
    dialogForm.value = {
      _sys: {
        enable: 1,
        name: indexInfo.value.name,
        code: indexInfo.value.code
      },
      data: {}
    };
    dialogRules.value = {
      _sys: {
        name: [
          { required: true, message: "任务名称必填", trigger: "blur" },
          { max: 30, message: "任务名称不能超过30字", trigger: "blur" }
        ]
      }
    };
    dialogColumn.value = [];
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
    dialogColumn,
    indexInfo,
    tableTitle,
    addTask,
    doCheckTask,
    doCheckAndSaveTask,
    closeDialog
  };
}
