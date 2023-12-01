<template>
  <el-dialog :title="`${props.titlePrefix}Webhook`" v-model="show" fullscreen append-to-body @close="closeDialog">
    <el-form ref="formDialogRef" :model="dialogForm" :rules="dialogRules" label-width="15vw" :label-position="labelPosition" v-loading="loading.form">
      <el-row v-show="showTaskSelect">
        <el-col :span="24">
          <el-form-item label="类型:" prop="_index">
            <el-select v-model="dialogForm._index" :placeholder="`请选择Webhook类型`" style="width: 100%" @change="changeIndex">
              <el-option v-for="option in webhookStore.getAllList" :key="option" :label="option" :value="option" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注名称:" prop="_sys.name">
            <el-input v-model="dialogForm._sys.name" placeholder="请输入任务名称" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="状态:" prop="_sys.enable">
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
          <el-form-item :prop="item.field">
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
              <!-- 自定义webhook模式，特殊处理-->
              <el-col v-if="dialogForm._index === '自定义' && item.field === 'successFlag'">
                <el-input v-if="item.fieldType === 'String'" v-model="dialogForm.data[item.field]" :placeholder="`请输入${item.name}`" />
                <el-input v-if="item.fieldType === 'String'" v-model="dialogForm.data[item.field]" :placeholder="`请输入${item.name}`" />
              </el-col>
              <el-col :span="24" v-else>
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
              </el-col>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="doCheckTask(formDialogRef)" :loading="loading.button"> 测试 </el-button>
        <el-button type="primary" @click="doCheckAndSaveTask(formDialogRef)" :loading="loading.button"> 保存 </el-button>
        <el-button type="danger" @click="closeDialog" :loading="loading.button"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { checkAndSaveTask, checkTask } from "@/api/auto";
import { isAllEmpty } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { Result } from "@/api/utils";
import { useWebhookColumnStoreHook } from "@/store/modules/webhook";
import { viewWebhook } from "@/api/webhook";
import QuestionFilled from "@iconify-icons/ep/question-filled";

defineOptions({ name: "WebhookDialog" });

class WebhookDialogForm {
  _index: string;
  _sys: {
    id: any;
    name: string;
    enable: number;
  };
  data: object;
}

const props = defineProps({
  titlePrefix: String,
  visible: Boolean,
  id: Number
});

const webhookStore = useWebhookColumnStoreHook();
const show = ref(false);
const updateMode = ref(false);
const showTaskSelect = ref(false);
const indexList = ref([]);
// 表单数据
const dialogForm = ref<WebhookDialogForm>({
  _index: undefined,
  _sys: {
    id: undefined,
    name: "",
    enable: 1
  },
  data: {}
});
// 表单渲染字段
const dialogColumn = ref([]);
// 表单校验规则
const dialogRules = ref({
  _index: [],
  _sys: {
    name: []
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
      // load column
      loading.form = true;
      if (!isAllEmpty(props.id)) {
        await loadViewData();
      }
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
  if (!updateMode.value) {
    // 展示任务选择框
    if (indexList.value === undefined || indexList.value.length === 0) {
      indexList.value = webhookStore.getAllList;
    }
    showTaskSelect.value = true;
  }
  if (!isAllEmpty(dialogForm.value._index)) {
    // 根据indexId获取表单
    const data = webhookStore.getDataByCode(dialogForm.value._index);
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
    // 如果不是更新状态就默认填充一些东西
    if (!updateMode.value) {
      dialogForm.value._sys.name = dialogForm.value._index + "推送";
    }
  }
}

async function loadViewData() {
  await viewWebhook(props.id)
    .then((data) => {
      if (data.success) {
        updateMode.value = true;
        dialogForm.value._sys.id = data.data.id;
        dialogForm.value._sys.name = data.data.name;
        dialogForm.value._sys.enable = data.data.enable;
        dialogForm.value._index = data.data.type;
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
      checkTask(dialogForm.value._index.id, dialogForm.value)
        .then((data) => {
          resolveCheckTask(data, false);
        })
        .finally(() => {
          loading.button = false;
        });
    }
  });
}

async function doCheckAndSaveTask(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      loading.button = true;
      checkAndSaveTask(dialogForm.value._index.id, dialogForm.value)
        .then((data) => {
          resolveCheckTask(data, true);
        })
        .finally(() => {
          loading.button = false;
        });
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
      dangerouslyUseHTMLString: true,
      duration: 10 * 1000
    });
  }
}

function initForm() {
  dialogForm.value = {
    _index: undefined,
    _sys: {
      enable: 1,
      name: "",
      id: undefined
    },
    data: {}
  };
  dialogRules.value = {
    _index: [{ required: true, message: "类型必选", trigger: "blur" }],
    _sys: {
      name: [
        { required: true, message: "Webhook名称必填", trigger: "blur" },
        { max: 50, message: "Webhook名称不能超过50字", trigger: "blur" }
      ]
    }
  };
  dialogColumn.value = [];
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
