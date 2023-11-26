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
      // 头部按钮
      headButton: [
        {
          type: "primary",
          click: showBiliQrcode,
          text: "扫码登录"
        }
      ]
      // 底部按钮，建议最多塞一个，要不然移动端会原地爆炸
      // bottomButton: [
      //   {
      //     type: "info",
      //     click: showBiliQrcode,
      //     text: "扫码登录"
      //   }
      // ]
    },
    MihoyouSign: {
      // 头部折叠面板
      headDesc: [
        {
          title: "关于cookie的说明",
          // 这边的html因为是v-html直接渲染的缘故，无法使用组件，请使用原生html的形式来写
          html:
            "<p>米游社中的cookie没有login_ticket字段，如果需要使用米游币任务，请前往米哈游通行证页面获取cookie</p>" +
            "<p>" +
            "    <span style='color: red'>电脑端</span>可以将后面的链接拖动到书签，登录米游社点击书签即可获取：" +
            '    <a class="el-button" href="javascript:(function(){let domain=document.domain;let cookie=document.cookie;prompt(\'Cookies: \'+domain, cookie)})();" target="_blank">Ganyu Cookies Getter' +
            "    </a>" +
            "    <br>" +
            '    <span style="color: red">手机端</span>请查看' +
            '    <a class="el-button el-button--primary" href="https://blog.oldwu.top/index.php/archives/84/#toc_9" target="_blank">使用说明</a>' +
            "</p>"
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
