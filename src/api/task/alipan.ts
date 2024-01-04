import { http } from "@/utils/http";
import { baseUrlApi, Result } from "@/api/utils";

class AliPanQrCodeGenerateInfo {
  t: string;
  ck: string;
  codeContent: string;
  resultCode: number;
}

class AliPanQrCodeStateInfo {
  qrCodeStatus: string;
  resultCode: number;
  bizExt: any;
}

/** 获取二维码对象 */
export const getAliPanQrCode = () => {
  return http.request<Result<AliPanQrCodeGenerateInfo>>("get", baseUrlApi("/task/alipan/getQrCode"));
};

/** 获取二维码扫描结果对象 */
export const getAliPanQrCodeResult = (data: object) => {
  return http.request<Result<AliPanQrCodeStateInfo>>("post", baseUrlApi("/task/alipan/getQrCodeResult"), { data });
};
