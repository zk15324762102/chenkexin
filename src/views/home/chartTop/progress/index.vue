<template>
  <div class="progress">
    <v-chart :option="getOption()"></v-chart>
  </div>
</template>

<script setup lang="ts">
//水球图
const getOption = () => {
  return {
    xAxis: {
         show:false,
         //水平方向最大数值与最小数值
         min:0,
         max:100,
    },
    yAxis: {
        type:"category",
        show:false
    },
    series: {
      type: "bar",
      data:[80],
      //柱条宽度
      barWidth:'10',
      //柱条的背景颜色
      showBackground:true,
      backgroundStyle:{
           color:'#ccc'
      },
      //柱状图的文本标签
      label:{
         show:true,
         //文字位置
         position:"right",
        //标签自定义文字内容
        formatter:'|' ,
        //文字颜色
        color:'yellowgreen'
      }
    },
    grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
    }
  };
};
</script>

<style scoped>
.progress {
  width: 100%;
  height: 100%;
}
</style>
