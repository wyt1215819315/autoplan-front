import { Md5 } from "ts-md5";

export const md5 = (txt: string | any) => {
  return Md5.hashStr(txt); // 对需要加密的数据进行加密
};
