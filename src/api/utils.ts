export const baseUrlApi = (url: string) => {
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return process.env.NODE_ENV === "development"
    ? `/api${url}`
    : `${import.meta.env.VITE_API_BASE_PATH}${url}`;
};
