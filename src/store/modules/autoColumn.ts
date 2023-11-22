import { defineStore } from "pinia";
import { store } from "@/store";
import { AutoIndex, getColumn } from "@/api/auto";

class AutoIndexDisplayInfo {
  field: string;
  fieldType: string;
  name: string;
  options: Array<object>;
}

class AutoIndexData {
  index: AutoIndex;
  icon: null | string;
  settings: Array<any>;
  display: Array<AutoIndexDisplayInfo>;
}

class StatusData {
  content: string;
  type: string;
}

export const useAutoColumnStore = defineStore({
  id: "auto-column",
  state: () => ({
    idDataMap: new Map<string, AutoIndexData>(),
    codeDataMap: new Map<string, AutoIndexData>(),
    statusMap: new Map<number, StatusData>()
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
    getStatusContent(status: number): string {
      if (status === undefined) {
        return "从未运行";
      } else if (this.statusMap.has(status)) {
        return this.statusMap.get(status).content;
      } else {
        return "未知状态(" + status + ")";
      }
    },
    getStatusDisplayType(status: number): string {
      if (this.statusMap.has(status)) {
        return this.statusMap.get(status).type;
      } else {
        return "info";
      }
    },
    getColumnName(code: string, key: string | number): string {
      const data = this.codeDataMap.get(code);
      if (data !== undefined) {
        for (const col of data.display) {
          if (col.field === key) {
            return col.name;
          }
        }
      }
      return "未解析的字段";
    },
    async initData() {
      this.idDataMap = new Map<string, AutoIndexData>();
      this.codeDataMap = new Map<string, AutoIndexData>();
      this.initStatusContentMapData();
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
    },
    initStatusContentMapData() {
      this.statusMap = new Map<number, StatusData>();
      this.statusMap.set(200, { content: "运行成功", type: "success" });
      this.statusMap.set(201, { content: "部分运行成功", type: "warning" });
      this.statusMap.set(500, { content: "系统错误", type: "danger" });
      this.statusMap.set(501, { content: "用户信息校验失败", type: "danger" });
      this.statusMap.set(502, { content: "任务内部错误", type: "danger" });
      this.statusMap.set(503, { content: "任务初始化失败", type: "danger" });
      this.statusMap.set(504, { content: "任务执行超时", type: "danger" });
      this.statusMap.set(510, { content: "未知运行错误", type: "danger" });
    }
  }
});

export function useAutoColumnStoreHook() {
  return useAutoColumnStore(store);
}
