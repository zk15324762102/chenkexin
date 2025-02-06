<template>
  <div class="line" ref="line"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
//获取divDOM元素
const line = ref();
onMounted(() => {
  initLine();
});

//初始化echarts实例
const initLine = () => {
  const mycharts = echarts.init(line.value);
  //设置配置项
  mycharts.setOption({
    xAxis: {
      type: "category",
      //两个不留白
      boundaryGap: false,
      //隐藏x轴
      show: false,
      //指示器
      axisPointer: {
        //显示指示器
        show: true,
        //指示器的类型
        type: "line",
      },
    },
    yAxis: {
      //隐藏y轴
      show: false,
    },
    series: {
      type: "line",
      data:data.arr,
      //圆滑曲线
      smooth: true,
      //区域填充颜色
      areaStyle: {
        color: "skyblue",
      },
      //拐点隐藏
      symbol: "none",
    },
    //调整布局
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      show: true,
      backgroundColor: "rgba(10,120,90,.1)",
    },
    //提示框组件
    tooltip: {
      //显示提示款在容器内
      confine: true,
      backgroundColor: "rgba(10,120,90,.1)",
    },
  });

  //图形图标自适应
  window.onresize = function () {
    //图标的自适应
    mycharts.resize();
  };
};

const data = defineProps(["arr"]);

</script>

<style scoped>
.line {
  width: 100%;
  height: 100%;
}
</style>
