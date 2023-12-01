import { defineStore } from "pinia";
import { store } from "@/store";
import { getColumn } from "@/api/webhook";

class PushConfigOptions {
  value: number;
  name: string;
}

class PushConfig {
  field: string;
  name: string;
  desc: string;
  defaultValue: string;
  ref: string;
  refValue: Array<number>;
  options: Array<PushConfigOptions>;
}

export const useWebhookColumnStore = defineStore({
  id: "webhook",
  state: () => ({
    list: Array<string>,
    data: new Map<string, PushConfig>()
  }),
  getters: {
    getAllList(state) {
      return state.list;
    },
    getDataMap(state) {
      return state.data;
    }
  },
  actions: {
    getDataByCode(code: string): string {
      return this.data.get(code);
    },
    async initData() {
      this.data = new Map<string, PushConfig>();
      getColumn().then((data) => {
        if (data.success) {
          this.list = data.data.list;
          for (const key in data.data.data) {
            this.data.set(key, data.data.data[key]);
          }
        }
      });
    }
  }
});

export function useWebhookColumnStoreHook() {
  return useWebhookColumnStore(store);
}
