<template>
  <el-dialog :title="`${props.titlePrefix}${dialogForm._index.name}任务`" v-model="show" fullscreen append-to-body @close="closeDialog">
    <el-form ref="formDialogRef" :model="dialogForm" :rules="dialogRules" label-width="15vw" v-loading="loading.form">
      <el-row v-show="showTaskSelect">
        <el-col :span="24">
          <el-form-item label="任务选择:" prop="_index.name">
            <el-select v-model="dialogForm._index" :placeholder="`请选择任务类型`" style="width: 100%" @change="loadColumn">
              <el-option v-for="option in indexList" :key="option.id" :label="option.name" :value="option" />
            </el-select>
            <el-input v-model="dialogForm._sys.name" placeholder="请输入任务名称" maxlength="30" />
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
              v-model="dialogForm.data[item.field]"
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
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="doCheckTask(formDialogRef)" :loading="loading.button"> 校验 </el-button>
        <el-button type="primary" @click="doCheckAndSaveTask(formDialogRef)" :loading="loading.button"> 校验并提交 </el-button>
        <el-button type="danger" @click="closeDialog" :loading="loading.button"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { checkAndSaveTask, checkTask, getIndexList, getSettingColumn } from "@/api/auto";
import { useAutoColumnStoreHook } from "@/store/modules/autoColumn";
import { isEmpty } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";

defineOptions({ name: "TaskDialog" });
const props = defineProps({
  titlePrefix: Boolean,
  visible: Boolean,
  indexId: Number,
  taskId: Number,
  indexCode: String
});
const show = ref(false);
const showTaskSelect = ref(false);
const indexList = ref([]);
// 表单数据
const dialogForm = ref({
  _index: {
    id: "",
    code: "",
    name: ""
  },
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

watch(
  () => props.indexId,
  (newValue) => {
    if (!isEmpty(newValue)) {
      if (typeof newValue === "string") {
        newValue = Number(newValue);
      }
      if (useAutoColumnStoreHook().idDataMap.has(newValue)) {
        message("获取任务表单失败，请刷新页面重试！", { type: "error" });
      } else {
        dialogForm.value._index = useAutoColumnStoreHook().idDataMap.get(newValue);
      }
    }
  }
);

watch(
  () => props.indexCode,
  (newValue) => {
    if (!isEmpty(newValue)) {
      if (useAutoColumnStoreHook().codeDataMap.has(newValue)) {
        message("获取任务表单失败，请刷新页面重试！", { type: "error" });
      } else {
        dialogForm.value._index = useAutoColumnStoreHook().codeDataMap.get(newValue);
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
      await loadColumn();
      loading.form = false;
    } else {
      initForm();
    }
  }
);

async function loadColumn() {
  if (isEmpty(dialogForm.value._index.id)) {
    // 展示任务选择框
    await loadIndexList();
    showTaskSelect.value = true;
  } else {
    // 根据indexId获取表单
    await getSettingColumn(dialogForm.value._index.id).then((data) => {
      if (data.success) {
        for (const item of data.data) {
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
      }
    });
  }
}

async function doCheckTask(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      loading.button = true;
      checkTask(dialogForm.value._index.id, dialogForm.value)
        .then((data) => {
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
          if (data.data.success) {
            message(data.data.msg, {
              type: "success"
            });
            closeDialog();
          } else {
            message(data.data.msg, {
              type: "error",
              dangerouslyUseHTMLString: true,
              duration: 10 * 1000
            });
          }
        })
        .finally(() => {
          loading.button = false;
        });
    }
  });
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
      code: ""
    },
    _sys: {
      enable: 1,
      name: "",
      code: ""
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

function closeDialog() {
  emit("closeDialog");
}
</script>
