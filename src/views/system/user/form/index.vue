<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { loginRules } from "@/views/login/utils/rule";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    username: "",
    password: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="82px">
    <el-row>
      <el-col>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="newFormInline.username" clearable placeholder="请输入用户名称" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="用户密码" prop="password" :rules="loginRules.password">
          <el-input v-model="newFormInline.password" clearable show-password placeholder="请输入用户密码" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
