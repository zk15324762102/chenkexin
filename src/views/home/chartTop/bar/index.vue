<template>
  <div class="bar">
    <!-- autoresize:自适应 -->
    <v-chart :option="getOption()" autoresize></v-chart>
  </div>
</template>

<script setup lang="ts">
const getOption = () => {
  return {
    xAxis: {
      type: "category",
      show: false,
    },
    yAxis: {
      show: false,
    },
    series: {
      type: "bar",
      data:data.arr 
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    //提示框组件
    tooltip: {
      axisPointer: {
        type: "cross",
      },
    },
  };
  
};

const data = defineProps(["arr"]);
</script>

<style scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>
