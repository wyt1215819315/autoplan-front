export type Result<T> = {
  success: boolean;
  code: number;
  msg?: string;
  data?: T;
};

export type PageBean<T> = {
  current: number;
  size: number;
  total: number;
  records: Array<T>;
};

export type PageResult<T> = {
  success: boolean;
  code: number;
  msg?: string;
  data?: PageBean<T>;
};

export const baseUrlApi = (url: string) => {
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return process.env.NODE_ENV === "development" ? `/api${url}` : `${import.meta.env.VITE_API_BASE_PATH}${url}`;
};
