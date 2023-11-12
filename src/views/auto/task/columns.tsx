import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import {
  getIndexInfo,
  getSettingColumn,
  getTaskPage,
  getUserInfoColumn
} from "@/api/auto";
import { useUserStoreHook } from "@/store/modules/user";

class AutoIndex {
  id: number;
  name: string;
  code: string;
  icon: string;
}

export function useColumns(parameter) {
  const dataList = ref([]);
  const loading = ref(true);
  const select = ref(true);
  const hideVal = ref("nohide");

  const indexInfo = ref<AutoIndex>();
  const tableTitle = ref("自动任务列表");
  const indexId = parameter.id;

  const dialog = reactive({
    visible: false,
    title: ""
  });
  const dialogForm = ref({});
  const dialogColumn = ref([]);
  const dialogRules = ref({
    userName: [
      { required: true, message: "用户名称不能为空", trigger: "blur" },
      {
        min: 2,
        max: 20,
        message: "用户名称长度必须介于 2 和 20 之间",
        trigger: "blur"
      }
    ],
    nickName: [
      { required: true, message: "用户昵称不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "用户密码不能为空", trigger: "blur" },
      {
        min: 5,
        max: 20,
        message: "用户密码长度必须介于 5 和 20 之间",
        trigger: "blur"
      }
    ],
    email: [
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ],
    phonenumber: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur"
      }
    ]
  });

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
      width: 60,
      prop: "enable"
    },
    {
      label: "任务状态",
      width: 120,
      prop: "lastEndStatus",
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          // loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.lastEndStatus}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          disabled={!useUserStoreHook().isAdmin()}
          // onChange={() => onChange(scope as any)}
        />
      )
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
    loading.value = true;
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
        dataList.value.push({
          tableNo: 111,
          enable: 1
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function addTask() {
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
              dialogForm.value[item.field] = Number(item.defaultValue);
            } else {
              dialogForm.value[item.field] = item.defaultValue;
            }
          }
        }
      }
    });
  }

  function closeDialog() {
    dialog.visible = false;
    dialog.title = "";
    dialogForm.value = {};
    dialogRules.value = {};
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
    closeDialog
  };
}
