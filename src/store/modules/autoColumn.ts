import { defineStore } from "pinia";
import { store } from "@/store";
import { getColumn } from "@/api/auto";

class AutoIndexData {
  index: object;
  settings: Array<any>;
  display: Array<any>;
}

export const useAutoColumnStore = defineStore({
  id: "auto-column",
  state: () => ({
    idDataMap: new Map<number, AutoIndexData>(),
    codeDataMap: new Map<string, AutoIndexData>()
  }),
  actions: {
    async initData() {
      this.idDataMap = new Map();
      this.codeDataMap = new Map();
      getColumn().then((data) => {
        if (data.success) {
          for (const key in data.data) {
            this.codeDataMap.set(key, data.data[key]);
          }
          for (const key in this.codeDataMap) {
            const obj = this.codeDataMap.get(key);
            this.idDataMap.set(obj.index.id, obj);
          }
        }
      });
    }
  }
});

export function useAutoColumnStoreHook() {
  return useAutoColumnStore(store);
}
