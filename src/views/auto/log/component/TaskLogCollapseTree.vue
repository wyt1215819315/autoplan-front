<template>
  <el-collapse-item :name="index" :title="item.data" style="padding-left: 18px" :disabled="isAllEmpty(item.children)">
    <template #title>
      <StatusIcon :status="item.style" :size="18" />
      {{ item.data }}
    </template>
    <div v-for="(info, infoIndex) in item.children" :key="infoIndex" class="task-info-div">
      <!--      <template v-if="isAllEmpty(info.children)">-->
      <!--        <span><StatusIcon :status="item.style" :size="18" /></span>-->
      <!--        <span>{{ info.data }}</span>-->
      <!--        <span>{{ info.children }}</span>-->
      <!--      </template>-->
      <!--      <template v-else>-->
      <el-collapse v-model="activeNames" style="border-bottom: 0">
        <!--        <TaskLogCollapseTree v-for="(childItem, childIndex) in info.children" :item="childItem" :index="childIndex" :key="childIndex" />-->
        <TaskLogCollapseTree :item="info" :index="infoIndex" :depth="props.depth + 1" :key="infoIndex" />
      </el-collapse>
      <!--      </template>-->
    </div>
  </el-collapse-item>
</template>
<script setup lang="ts">
import StatusIcon from "@/views/auto/log/component/StatusIcon.vue";
import { ref } from "vue";
import { isAllEmpty } from "@pureadmin/utils";
// 麻了为什么当初要用el-collapse来实现，直接用数组件不就完了 操
defineOptions({
  name: "TaskLogCollapseTree"
});

class LogDisplayDataClass {
  style: string;
  data: string;
  children: Array<LogDisplayDataClass>;
}

const props = defineProps({
  item: {
    type: Object as () => LogDisplayDataClass,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  depth: {
    type: Number,
    required: true
  }
});

const activeNames = ref([]);
</script>
