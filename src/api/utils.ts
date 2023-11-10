export type Result = {
  success: boolean;
  code: number;
  msg?: string;
  data?: any;
};

export type PageBean = {
  current: number;
  size: number;
  total: number;
  records: Array<any>;
};

export const baseUrlApi = (url: string) => {
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return process.env.NODE_ENV === "development"
    ? `/api${url}`
    : `${import.meta.env.VITE_API_BASE_PATH}${url}`;
};
