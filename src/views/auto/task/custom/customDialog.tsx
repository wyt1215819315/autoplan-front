import { ref } from "vue";
import { message } from "@/utils/message";
import { addDialog, closeDialog, DialogOptions } from "@/components/ReDialog/index";
import ReQrcode from "@/components/ReQrcode";
import { getBiliQrCode, getBiliQrCodeResult } from "@/api/task/bili";
import { getAliPanQrCode, getAliPanQrCodeResult } from "@/api/task/alipan";

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
          // tsx语法
          html: (
            <div>
              <p>
                <a href={"https://www.miyoushe.com/ys/"} target={"_blank"}>
                  米游社
                </a>
                中的cookie没有login_ticket字段，如果需要使用米游币任务，请前往
                <a href={"https://user.mihoyo.com/#/login/captcha"} target={"_blank"}>
                  米哈游通行证
                </a>
                页面获取cookie
              </p>
              <p>
                <span style="color: red">电脑端</span>可以将后面的链接拖动到书签，登录米游社点击书签即可获取：
                <a
                  class="el-button"
                  href="javascript:(function(){let domain=document.domain;let cookie=document.cookie;prompt('Cookies: '+domain, cookie)})();"
                  target="_blank"
                >
                  Ganyu Cookies Getter
                </a>
                <br />
                <span style="color: red">手机端</span>请查看
                <a class="el-button el-button--primary" href="https://blog.oldwu.top/index.php/archives/84/#toc_9" target="_blank">
                  使用说明
                </a>
              </p>
            </div>
          )
        }
      ]
    },
    MiSport: {
      headDesc: [
        {
          title: "关于小米运动的说明",
          html: (
            <div>
              原小米运动已经改名为Zepp
              Life，并且当前仅支持邮箱注册，本任务采用的还是老版本的小米运动接口，因此只支持手机号登录，经过抓包看新版本的鉴权接口更换了域名，并且请求体做了加密，本人没有能力破解该加密，如果有大佬知道，可以提交pr或者联系我来对邮箱登录进行支持
            </div>
          )
        }
      ]
    },
    AliPanSign: {
      headButton: [
        {
          type: "primary",
          click: showAliPanQrcode,
          text: "扫码登录"
        }
      ]
    }
  });

  function showBiliQrcode(dialogForm: any) {
    let timer;
    const qrcodeUrl = ref("");
    const disabled = ref(false);
    const msg = ref("请扫描二维码");
    const dialogOptions = ref<DialogOptions>();
    const dialogIndex = ref<number>();
    function refreshQrCode() {
      disabled.value = false;
      getBiliQrCode().then((data) => {
        if (data.code === 0) {
          qrcodeUrl.value = data.data.url;
          // 启动一个定时器去监听二维码
          timer = setInterval(() => {
            setTimeout(() => {
              getBiliQrCodeResult(data.data.qrcode_key)
                .then((data) => {
                  if (data.success) {
                    if (data.data.code === 0) {
                      dialogForm.data.dedeuserid = data.data.DedeUserID;
                      dialogForm.data.biliJct = data.data.bili_jct;
                      dialogForm.data.sessdata = data.data.SESSDATA;
                      clearInterval(timer);
                      closeDialog(dialogOptions.value, dialogIndex.value);
                    } else if (data.data.code === 86090) {
                      msg.value = "已扫码，请在App上点击确认登录";
                    } else if (data.data.code === 86101) {
                      msg.value = "请扫描二维码";
                    } else if (data.data.code === 86038) {
                      msg.value = "二维码已失效";
                      disabled.value = true;
                      clearInterval(timer);
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
          closeDialog(dialogOptions.value, dialogIndex.value);
        }
      });
    }
    // bilibili扫码登录
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
          <ReQrcode disabled={disabled.value} width={250} text={qrcodeUrl.value} onDisabled-click={() => refreshQrCode()} />
        </el-card>
      ),
      close: () => {
        if (timer !== undefined) {
          clearInterval(timer);
        }
      }
    });
    refreshQrCode();
  }

  function showAliPanQrcode(dialogForm: any) {
    let timer;
    const qrcodeUrl = ref("");
    const disabled = ref(false);
    const msg = ref("");
    const dialogOptions = ref<DialogOptions>();
    const dialogIndex = ref<number>();
    function refreshQrCode() {
      msg.value = "请使用阿里云盘手机App扫描二维码";
      disabled.value = false;
      getAliPanQrCode().then((data) => {
        if (data.success) {
          qrcodeUrl.value = data.data.codeContent;
          // 启动一个定时器去监听二维码
          timer = setInterval(() => {
            setTimeout(() => {
              getAliPanQrCodeResult({
                ck: data.data.ck,
                t: data.data.t
              })
                .then((data) => {
                  if (data.success) {
                    if (data.data.qrCodeStatus === "CONFIRMED") {
                      dialogForm.data.token = data.data.bizExt.pds_login_result.refreshToken;
                      message("自动填充 Refresh Token 成功", { type: "success" });
                      clearInterval(timer);
                      closeDialog(dialogOptions.value, dialogIndex.value);
                    } else if (data.data.qrCodeStatus === "NEW") {
                      msg.value = "请使用阿里云盘手机App扫描二维码";
                    } else if (data.data.qrCodeStatus === "SCANED") {
                      msg.value = "已扫码，请在App上点击确认登录";
                    } else if (data.data.qrCodeStatus === "CANCELED") {
                      msg.value = "用户取消扫描";
                      disabled.value = true;
                      clearInterval(timer);
                    } else if (data.data.qrCodeStatus === "EXPIRED") {
                      msg.value = "二维码已失效";
                      disabled.value = true;
                      clearInterval(timer);
                    } else {
                      msg.value = "未知状态，请重新获取二维码";
                      disabled.value = true;
                      clearInterval(timer);
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
          message("获取二维码失败 " + data.msg);
          closeDialog(dialogOptions.value, dialogIndex.value);
        }
      });
    }
    // bilibili扫码登录
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
          <ReQrcode disabled={disabled.value} width={250} text={qrcodeUrl.value} onDisabled-click={() => refreshQrCode()} />
        </el-card>
      ),
      close: () => {
        if (timer !== undefined) {
          clearInterval(timer);
        }
      }
    });
    refreshQrCode();
  }

  function getCustomInfo(): any {
    if (object.value[code] !== undefined) {
      return object.value[code];
    }
    return null;
  }

  return { getCustomInfo };
}
