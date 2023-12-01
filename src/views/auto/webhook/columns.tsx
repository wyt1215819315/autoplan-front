import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { LoadingConfig } from "@pureadmin/table";
import { useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";
import { deleteWebhook, getWebHookList } from "@/api/webhook";

export function useColumns() {
  const dataList = ref([]);
  const loading = ref({
    main: true
  });
  const select = ref(true);
  const hideVal = ref("nohide");

  const dialog = reactive({
    visible: false,
    title: "",
    taskId: undefined
  });

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
      label: "名称",
      minWidth: 100,
      prop: "name"
    },
    {
      label: "推送类型",
      minWidth: 100,
      prop: "type"
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
          // onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "操作",
      width: 120,
      fixed: "right",
      slot: "operation",
      hide: !useUserStoreHook().isAdmin()
    }
  ];

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

  onMounted(() => {
    delay(100).then(() => {
      requestData();
    });
  });

  function requestData() {
    loading.value.main = true;
    getWebHookList()
      .then((data) => {
        if (data.success) {
          dataList.value = [];
          for (let i = 0; i < data.data.length; i++) {
            const record = data.data[i];
            record.tableNo = i + 1;
            dataList.value.push(record);
          }
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
    deleteWebhook(row.id)
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
    loadingConfig,
    requestData,
    dialog,
    addTask,
    editTask,
    delTask,
    closeDialog
  };
}
