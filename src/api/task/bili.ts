import { http } from "@/utils/http";
import { baseUrlApi, Result } from "@/api/utils";

class BiliResult<T> {
  code: number;
  message?: string;
  ttl?: number;
  data?: T;
}

class BiliQrCodeGetData {
  url: string;
  qrcode_key: string;
}

/** 获取二维码对象 */
export const getBiliQrCode = () => {
  return http.request<BiliResult<BiliQrCodeGetData>>("get", baseUrlApi("/task/bili/getQrCode"));
};

/** 获取二维码扫描结果对象 */
export const getBiliQrCodeResult = (qrCodeKey: string) => {
  return http.request<Result<any>>("get", baseUrlApi("/task/bili/getQrCodeResult/" + qrCodeKey));
};
