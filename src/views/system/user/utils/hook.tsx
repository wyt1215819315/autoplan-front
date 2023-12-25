import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import { getKeyList, isAllEmpty, delay } from "@pureadmin/utils";
import { getRoleIds, getUserList, getAllRoleList, deleteUser, saveUser, updateUser, editUserRole } from "@/api/system/system";
import { ElForm, ElInput, ElFormItem, ElProgress } from "element-plus";
import { type Ref, h, ref, watch, computed, reactive, onMounted } from "vue";
import { md5 } from "@/utils/crypto";

export function useUser(tableRef: Ref) {
  const form = reactive({
    username: "",
    phone: "",
    status: ""
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "序号",
      prop: "tableNo",
      width: 60
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 130
    },
    {
      label: "注册时间",
      minWidth: 90,
      prop: "regdate",
      formatter: ({ createTime }) => dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return ["!h-[20px]", "reset-margin", "!text-gray-500", "dark:!text-white", "dark:hover:!text-primary"];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  function handleDelete(row) {
    deleteUser(row.id).then((data) => {
      if (data.success) {
        message("删除成功！", { type: "success" });
        onSearch();
      }
    });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    delay(100).then(() => {
      onSearch();
    });
  }

  function handleCurrentChange(val: number) {
    delay(100).then(() => {
      onSearch();
    });
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    for (const row of curSelected) {
      handleDelete(row);
    }
    tableRef.value.getTableRef().clearSelection();
  }

  function onSearch() {
    loading.value = true;
    getUserList({
      size: pagination.pageSize,
      current: pagination.currentPage,
      username: form.username
    })
      .then((data) => {
        pagination.total = data.data.total;
        dataList.value = [];
        for (let i = 0; i < data.data.records.length; i++) {
          const record = data.data.records[i];
          record.tableNo = (pagination.currentPage - 1) * pagination.pageSize + i + 1;
          // 解析settings json字符串到列表中去
          dataList.value.push(record);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          username: row?.username ?? "",
          password: row?.password ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores(data: any) {
          if (data.success) {
            message(title + "成功！", { type: "success" });
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        }
        FormRef.validate((valid) => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              saveUser({
                username: curData.username,
                password: md5(curData.password)
              }).then((data) => {
                if (data.success) {
                  chores(data);
                }
              });
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              updateUser({
                id: row.id,
                username: curData.username,
                password: md5(curData.password)
              }).then((data) => {
                if (data.success) {
                  chores(data);
                }
              });
            }
          }
        });
      }
    });
  }

  watch(pwdForm, ({ newPwd }) => (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score));

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput clearable show-password type="password" v-model={pwdForm.newPwd} placeholder="请输入新密码" />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div class="w-[19vw]" style={{ marginLeft: idx !== 0 ? "4px" : 0 }}>
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p class="text-center" style={{ color: curScore.value === idx ? color : "" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: (done) => {
        ruleFormRef.value.validate((valid) => {
          if (valid) {
            // 表单规则校验通过
            updateUser({
              id: row.id,
              password: md5(pwdForm.newPwd)
            }).then((data) => {
              if (data.success) {
                message(`已成功重置 ${row.username} 用户的密码`, {
                  type: "success"
                });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              }
            });
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const ids = getKeyList((await getRoleIds(row.id)).data ?? [], "id");
    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        editUserRole({
          userId: row.id,
          roleIds: curData.ids
        }).then((data) => {
          if (data.success) {
            message("分配角色成功！", { type: "success" });
            done(); // 关闭弹框
          }
        });
      }
    });
  }

  onMounted(async () => {
    onSearch();
    // 角色列表
    roleOptions.value = (await getAllRoleList()).data;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    handleDelete,
    handleReset,
    handleRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
