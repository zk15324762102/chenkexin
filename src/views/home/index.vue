<template>
  <div>
    <Top :data="chartObj" />
    <Middle :data="chartObj" />
    <Bottom />
  </div>
</template>

<script setup lang="ts">
import Middle from "./chartMiddle/index.vue";
import Bottom from "./chartBottom/index.vue";
import Top from "./chartTop/index.vue";
//引入请求函数
import { reqCharts } from "@/api/home";
import { ref, onMounted } from "vue";
//存储首页数据可视化的数据对象
const chartObj = ref({});
//组件挂载完毕:获取首页需要数据
onMounted(() => {
  getData();
});
//获取首页全部的数据方法
const getData = async() => {
    const result = await reqCharts();
    //存储数据
    chartObj.value = result;
};
</script>

<style scoped></style>
