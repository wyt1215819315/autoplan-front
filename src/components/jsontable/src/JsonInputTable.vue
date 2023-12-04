<template>
  <el-table :data="attrData" style="width: 100%">
    <el-table-column v-for="item in props.dataModel" :key="item.field" :prop="item.field" :label="item.name">
      <template v-slot="scope">
        <el-select v-if="item.fieldType === 'select'" v-model="scope.row[item.field]" :placeholder="`请选择${item.name}`" style="width: 100%">
          <el-option v-for="option in item.selectValue" :key="option" :label="option" :value="option" />
        </el-select>
        <el-input v-else v-model="scope.row[item.field]" :placeholder="`请输入${item.name}`" />
      </template>
    </el-table-column>
    <el-table-column width="100">
      <template v-slot:header>
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </template>
      <template v-slot="scope">
        <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { JsonTableModel } from "@/components/jsontable/src/hook";
import { isAllEmpty } from "@pureadmin/utils";
import { isJsonString } from "@/utils/oldwu-util";

const attrData = ref([] as any);

const props = defineProps({
  dataModel: {
    require: true,
    type: Object as () => Array<JsonTableModel>
  },
  data: {
    require: false,
    type: String
  }
});

const emit = defineEmits(["on-val-change"]);
// 当值发生变化时通知父容器更改值
watch(
  () => attrData.value,
  (newValue) => {
    emit("on-val-change", JSON.stringify(newValue), newValue);
  },
  {
    deep: true
  }
);

// 监控父容器传值，反解析值到table中
watch(
  () => props.data,
  (newValue) => {
    if (!isAllEmpty(newValue)) {
      if (typeof newValue === "string" && isJsonString(newValue)) {
        attrData.value = JSON.parse(newValue);
      } else if (typeof newValue === "object") {
        attrData.value = newValue;
      }
    }
  },
  {
    immediate: true
  }
);

function handleDelete(scope: any) {
  attrData.value.splice(scope.$index, 1);
}

function handleAdd() {
  attrData.value.unshift({});
}
</script>
