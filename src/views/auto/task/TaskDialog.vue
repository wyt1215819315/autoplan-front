<template>
  <el-dialog :title="`${props.titlePrefix}${dialogForm._index.name}任务`" v-model="show" fullscreen append-to-body @close="closeDialog">
    <el-collapse style="margin-bottom: 20px" v-model="collapseActiveName" accordion v-show="customHeadDesc.length > 0">
      <el-collapse-item class="custom-collapse" v-for="(item, index) of customHeadDesc" :key="index" :title="item.title" :name="index">
        <component :is="item.html" />
        <!--        <div v-html="item.html" />-->
      </el-collapse-item>
    </el-collapse>
    <div>
      <el-button v-for="(item, index) of customHeadButton" :key="index" :type="item.type" @click="item.click(dialogForm)" :loading="loading.button">
        {{ item.text }}
      </el-button>
    </div>
    <el-form ref="formDialogRef" :model="dialogForm" :rules="dialogRules" label-width="15vw" :label-position="labelPosition" v-loading="loading.form">
      <el-row v-show="showTaskSelect">
        <el-col :span="24">
          <el-form-item label="任务选择:" prop="_index.name">
            <el-select v-model="dialogForm._index" value-key="id" :placeholder="`请选择任务类型`" style="width: 100%" @change="changeIndex">
              <el-option v-for="option in indexList" :key="option.id" :label="option.name" :value="option" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="任务名称:" prop="_sys.name">
            <el-input v-model="dialogForm._sys.name" placeholder="请输入任务名称" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="任务状态:" prop="_sys.enable">
            <el-switch
              size="default"
              v-model="dialogForm._sys.enable"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="停用"
              inline-prompt
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 动态表单渲染-->
      <el-row v-for="(item, index) in dialogColumn" :key="index" v-show="item.ref === undefined || item.refValue.includes(dialogForm.data[item.ref])">
        <el-col :span="24">
          <el-form-item :label="`${item.name}:`" :prop="item.field">
            <template v-slot:label="{}">
              <div style="align-items: center; display: flex">
                <div v-show="!isAllEmpty(item.desc)">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <IconifyIconOffline :icon="QuestionFilled" style="margin-right: 5px" />
                    <template v-slot:content>
                      <div>{{ item.desc }}</div>
                    </template>
                  </el-tooltip>
                </div>
                <span>{{ item.name }}:</span>
              </div>
            </template>
            <template v-slot:default>
              <!-- 普通文本输入框-->
              <el-input v-if="item.fieldType === 'String'" v-model="dialogForm.data[item.field]" :placeholder="`请输入${item.name}`" />
              <!-- 长文本输入框-->
              <el-input
                v-if="item.fieldType === 'TextArea'"
                v-model="dialogForm.data[item.field]"
                type="textarea"
                :placeholder="`请输入${item.name}`"
              />
              <!-- 数字输入框-->
              <el-input
                v-if="(item.fieldType === 'Integer' || item.fieldType === 'Long' || item.fieldType === 'Double') && item.options === undefined"
                type="number"
                v-model.number="dialogForm.data[item.field]"
                :placeholder="`请输入${item.name}`"
              />
              <!-- 选择框-->
              <el-select
                v-if="item.options !== undefined"
                v-model="dialogForm.data[item.field]"
                :placeholder="`请选择${item.name}`"
                style="width: 100%"
              >
                <el-option v-for="option in item.options" :key="option.value" :label="option.name" :value="option.value" />
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-for="(item, index) of customBottomButton"
          :key="index"
          :type="item.type"
          @click="item.click(dialogForm)"
          :loading="loading.button"
        >
          {{ item.text }}
        </el-button>
        <el-button type="success" @click="doCheckTask(formDialogRef)" :loading="loading.button"> 校验 </el-button>
        <el-button type="primary" @click="doCheckAndSaveTask(formDialogRef)" :loading="loading.button"> 校验并提交 </el-button>
        <el-button type="danger" @click="show = false" :loading="loading.button"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { AutoIndex, checkAndSaveTask, checkAndUpdate, checkTask, checkTaskWithUpdate, getIndexList, viewTask } from "@/api/auto";
import { useAutoColumnStoreHook } from "@/store/modules/autoColumn";
import { isAllEmpty } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { Result } from "@/api/utils";
import { useCustomDialog } from "@/views/auto/task/custom/customDialog";
import QuestionFilled from "@iconify-icons/ep/question-filled";
class AutoDialogForm {
  _index: AutoIndex;
  _sys: {
    id: any;
    name: string;
    enable: number;
    code: string;
  };
  data: object;
}

defineOptions({ name: "TaskDialog" });
const props = defineProps({
  titlePrefix: String,
  visible: Boolean,
  indexId: String,
  taskId: String,
  indexCode: String
});
const collapseActiveName = ref(1);
const show = ref(false);
const updateMode = ref(false);
const showTaskSelect = ref(false);
const indexList = ref([]);
// 表单数据
const dialogForm = ref<AutoDialogForm>({
  _index: {
    id: "",
    code: "",
    name: "",
    icon: ""
  },
  _sys: {
    id: undefined,
    name: "",
    enable: 1,
    code: ""
  },
  data: {}
});
// 表单渲染字段
const dialogColumn = ref([]);
// 表单校验规则
const dialogRules = ref({
  _sys: {
    name: [
      { required: true, message: "任务名称必填", trigger: "blur" },
      { max: 30, message: "任务名称不能超过30字", trigger: "blur" }
    ]
  }
});
const formDialogRef = ref<FormInstance>();
// 加载
const loading = reactive({
  form: false,
  button: false
});
const emit = defineEmits(["closeDialog"]);
const windowWidth = ref();
const labelPosition = ref("right");
// 自定义规则
const customHeadButton = ref([]);
const customBottomButton = ref([]);
const customHeadDesc = ref([]);

onMounted(() => {
  window.onresize = () => {
    return (() => {
      windowWidth.value = document.documentElement.clientWidth; // 宽
    })();
  };
});
watch(
  () => windowWidth.value,
  (newValue) => {
    if (!isAllEmpty(newValue)) {
      if (newValue <= 768) {
        // 小屏设备
        labelPosition.value = "top";
      } else {
        labelPosition.value = "right";
      }
    }
  }
);
watch(
  () => props.visible,
  async (newValue) => {
    show.value = newValue;
    if (newValue === true) {
      // load props
      if (!isAllEmpty(props.indexId)) {
        const val = props.indexId;
        if (!useAutoColumnStoreHook().getIdDataMap.has(val)) {
          message("获取任务表单失败，请刷新页面重试！", { type: "error" });
          return;
        } else {
          dialogForm.value._index = useAutoColumnStoreHook().getIdDataMap.get(val).index;
        }
      } else if (!isAllEmpty(props.indexCode)) {
        const val = props.indexCode;
        if (!useAutoColumnStoreHook().getCodeDataMap.has(val)) {
          message("获取任务表单失败，请刷新页面重试！", { type: "error" });
          return;
        } else {
          dialogForm.value._index = useAutoColumnStoreHook().getCodeDataMap.get(val).index;
        }
      }
      // load column
      loading.form = true;
      await loadColumn();
      loading.form = false;
    } else {
      initForm();
    }
  }
);

async function changeIndex() {
  const _index = dialogForm.value._index;
  initForm();
  dialogForm.value._index = _index;
  await loadColumn();
}

async function loadColumn() {
  if (isAllEmpty(dialogForm.value._index.id)) {
    // 展示任务选择框
    await loadIndexList();
    showTaskSelect.value = true;
  } else {
    // 根据indexId获取表单
    const data = useAutoColumnStoreHook().getIdDataMap.get(dialogForm.value._index.id).settings;
    for (const item of data) {
      dialogColumn.value.push({
        ...item
      });
      // 填充默认值
      if (item.defaultValue !== undefined) {
        if (item.fieldType === "Integer" || item.fieldType === "Long" || item.fieldType === "Double") {
          dialogForm.value.data[item.field] = Number(item.defaultValue);
        } else {
          dialogForm.value.data[item.field] = item.defaultValue;
        }
      }
    }
    if (!isAllEmpty(props.taskId)) {
      await loadViewData();
    }
    // 如果不是更新状态就默认填充一些东西
    if (!updateMode.value) {
      dialogForm.value._sys.name = dialogForm.value._index.name + "任务";
    }
    // 加载自定义配置
    const { getCustomInfo } = useCustomDialog(dialogForm.value._index.code);
    if (getCustomInfo() != null) {
      if (!isAllEmpty(getCustomInfo().headButton)) {
        customHeadButton.value = getCustomInfo().headButton;
      }
      if (!isAllEmpty(getCustomInfo().bottomButton)) {
        customBottomButton.value = getCustomInfo().bottomButton;
      }
      if (!isAllEmpty(getCustomInfo().headDesc)) {
        customHeadDesc.value = getCustomInfo().headDesc;
      }
    }
  }
}

async function loadViewData() {
  await viewTask(props.taskId)
    .then((data) => {
      if (data.success) {
        updateMode.value = true;
        dialogForm.value._sys.id = data.data.id;
        dialogForm.value._sys.name = data.data.name;
        dialogForm.value._sys.enable = data.data.enable;
        for (const col in data.data.setting) {
          dialogForm.value.data[col] = data.data.setting[col];
        }
      }
    })
    .finally(() => {});
}

async function doCheckTask(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      loading.button = true;
      if (updateMode.value) {
        checkTaskWithUpdate(dialogForm.value)
          .then((data) => {
            resolveCheckTask(data, false);
          })
          .finally(() => {
            loading.button = false;
          });
      } else {
        checkTask(dialogForm.value._index.id, dialogForm.value)
          .then((data) => {
            resolveCheckTask(data, false);
          })
          .finally(() => {
            loading.button = false;
          });
      }
    }
  });
}

async function doCheckAndSaveTask(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      loading.button = true;
      if (updateMode.value) {
        checkAndUpdate(dialogForm.value)
          .then((data) => {
            resolveCheckTask(data, true);
          })
          .finally(() => (loading.button = false));
      } else {
        checkAndSaveTask(dialogForm.value._index.id, dialogForm.value)
          .then((data) => {
            resolveCheckTask(data, true);
          })
          .finally(() => {
            loading.button = false;
          });
      }
    }
  });
}

function resolveCheckTask(data: Result<any>, close: Boolean) {
  if (data.data.success) {
    message(data.data.msg, {
      type: "success"
    });
    if (close) {
      closeDialog();
    }
  } else {
    message(data.data.msg, {
      type: "error",
      showClose: true,
      dangerouslyUseHTMLString: true,
      duration: 10 * 1000
    });
  }
}

async function loadIndexList() {
  if (indexList.value === undefined || indexList.value.length === 0) {
    await getIndexList().then((data) => {
      indexList.value = data.data;
    });
  }
}

function initForm() {
  dialogForm.value = {
    _index: {
      id: "",
      name: "",
      code: "",
      icon: ""
    },
    _sys: {
      enable: 1,
      name: "",
      code: "",
      id: undefined
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
  updateMode.value = false;
  customBottomButton.value = [];
  customHeadDesc.value = [];
  customHeadButton.value = [];
}

function closeDialog() {
  emit("closeDialog");
}
</script>

<style lang="scss" scoped>
::v-deep(.custom-collapse) {
  .el-collapse-item__wrap {
    padding: 8px 16px;
    background-color: rgba(var(--el-color-primary-rgb), 0.1);
    border-radius: 4px;
    border-left: 5px solid var(--el-color-primary);
    margin: 20px 0;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
