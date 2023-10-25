<script setup lang="ts">
import { useRoute } from "vue-router";
import { isEmpty } from "@pureadmin/utils";

defineOptions({
  name: "TaskInfoPage"
});
const route = useRoute();
const parameter = isEmpty(route.params) ? route.query : route.params;
</script>

<template>
  <h1>{{ parameter.id }}</h1>
</template>
