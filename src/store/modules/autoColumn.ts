import { defineStore } from "pinia";
import { store } from "@/store";
import { AutoIndex, getColumn } from "@/api/auto";

class AutoIndexData {
  index: AutoIndex;
  settings: Array<any>;
  display: Array<any>;
}

export const useAutoColumnStore = defineStore({
  id: "auto-column",
  state: () => ({
    idDataMap: new Map<string, AutoIndexData>(),
    codeDataMap: new Map<string, AutoIndexData>()
  }),
  getters: {
    getIdDataMap(state) {
      return state.idDataMap;
    },
    getCodeDataMap(state) {
      return state.codeDataMap;
    }
  },
  actions: {
    async initData() {
      this.idDataMap = new Map();
      this.codeDataMap = new Map();
      getColumn().then((data) => {
        if (data.success) {
          for (const key in data.data) {
            this.codeDataMap.set(key, data.data[key]);
          }
          for (const key of this.codeDataMap.keys()) {
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
