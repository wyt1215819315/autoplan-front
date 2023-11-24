import { ref } from "vue";
import { message } from "@/utils/message";
import { addDialog, closeDialog, DialogOptions } from "@/components/ReDialog/index";
import ReQrcode from "@/components/ReQrcode";
import { getQrCode, getQrCodeResult } from "@/api/task/bili";

export function useCustomDialog(code: string) {
  class CustomDialogButton {
    type: "primary" | "success" | "warning" | "danger" | "info" | "text";
    click: any;
    text: string;
  }

  // 如果需要自定义任务弹框的内容，可以在这里编写，提供了三个位置的功能，把code作为key对应即可
  const object = ref({
    bili: {
      // 头部折叠面板
      headDesc: [
        {
          title: "测试头部折叠面板",
          html: (
            <div>
              <div>
                Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are
                used to;
              </div>
              <div>
                Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.
              </div>
            </div>
          )
        }
      ],
      // 头部按钮
      headButton: [
        {
          type: "info",
          click: showBiliQrcode,
          text: "扫码登录"
        }
      ],
      // 底部按钮，建议最多塞一个，要不然移动端会原地爆炸
      bottomButton: [
        {
          type: "info",
          click: showBiliQrcode,
          text: "扫码登录"
        }
      ]
    }
  });

  function showBiliQrcode(dialogForm: any) {
    let timer;
    // bilibili扫码登录
    getQrCode().then((data) => {
      if (data.code === 0) {
        const disabled = ref(false);
        const msg = ref("请扫描二维码");
        const dialogOptions = ref<DialogOptions>();
        const dialogIndex = ref<number>();
        addDialog({
          title: "扫码登录",
          hideFooter: true,
          width: 300,
          open: ({ options, index }) => {
            dialogOptions.value = options;
            dialogIndex.value = index;
          },
          contentRenderer: () => (
            <el-card shadow={"hover"} className={"mb-[10px] text-center"}>
              <div class={"font-bold"}>{msg.value}</div>
              <ReQrcode disabled={disabled.value} width={250} text={data.data.url} />
            </el-card>
          ),
          close: () => {
            if (timer !== undefined) {
              clearInterval(timer);
            }
          }
        });
        // 启动一个定时器去监听二维码
        timer = setInterval(() => {
          setTimeout(() => {
            getQrCodeResult(data.data.qrcode_key)
              .then((data) => {
                if (data.success) {
                  if (data.data.code === 0) {
                    dialogForm.data.dedeuserid = data.data.DedeUserID;
                    dialogForm.data.biliJct = data.data.bili_jct;
                    dialogForm.data.sessdata = data.data.SESSDATA;
                    closeDialog(dialogOptions.value, dialogIndex.value);
                  } else if (data.data.code === 86090) {
                    msg.value = "已扫码，请在App上点击确认登录";
                  } else if (data.data.code === 86101) {
                    msg.value = "请扫描二维码";
                  } else {
                    msg.value = data.data.message;
                  }
                  console.log(data.data);
                } else {
                  msg.value = "二维码已失效";
                  disabled.value = true;
                  clearInterval(timer);
                }
              })
              .catch((e) => {
                console.error(e);
                message("扫码登录出现异常：" + e, { type: "error" });
                disabled.value = true;
                clearInterval(timer);
              });
          }, 0);
        }, 1000 * 2);
      } else {
        message("获取二维码失败：" + data.message);
      }
    });
  }

  function getCustomInfo(): any {
    if (object.value[code] !== undefined) {
      return object.value[code];
    }
    return null;
  }

  return { getCustomInfo };
}
