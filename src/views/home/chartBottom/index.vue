<template>
  <el-row :gutter="10">
    <el-col :span="14">
      <!-- 左侧卡片 -->
      <el-card>
        <template #header>
          <div class="top">
            <div class="left">关键字搜索</div>
            <el-dropdown>
              <span class="el-dropdown-link">
                城市选择器<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>北京</el-dropdown-item>
                  <el-dropdown-item>上海 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <v-chart :option="getRadar()" style="height: 300px"></v-chart>
      </el-card>
    </el-col>
    <!-- 右侧卡片 -->
    <el-col :span="10">
      <el-card>
        <!-- 卡片头部 -->
        <template #header>
          <div class="top">
            <div>分类销售</div>
            <!-- 单选按钮 -->
            <el-radio-group size="small" v-model="radio">
              <el-radio-button label="品类" />
              <el-radio-button label="商品" />
            </el-radio-group>
          </div>
        </template>
        <!-- 展示饼图 -->
        <v-chart ref="charts" style="height: 300px" :option="getPie()" @mouseover="handler"></v-chart>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import { ref } from "vue";
//收集单选按钮的数据
const radio = ref("品类");
//同名的ref对象
const charts = ref();
//雷达图
const getRadar = () => {
  return {
    title: {
      text: "王者荣耀",
    },
    legend: {
      data: ["男生", "女生"],
      right: 0,
      orient: "vertical",
    },
    radar: {
      indicator: [
        { name: "生存", max: 6500 },
        { name: "发育", max: 16000 },
        { name: "猥琐", max: 30000 },
        { name: "别浪", max: 38000 },
        { name: "我们会赢", max: 52000 },
        { name: "坚持就是胜利", max: 25000 },
      ],
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: "男生",
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: "女生",
          },
        ],
      },
    ],
  };
};

//品类的数据
const arr = [{name:'华为',value:90},{name:'oppo',value:30},{name:'vivo',value:60},{name:'小米',value:99}];
//商品的数据
const arr1 = [{name:'华为1',value:190},{name:'oppo1',value:130},{name:'vivo1',value:160},{name:'小米1',value:199}]


//饼图的配置项
const getPie = () => {
  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
       right:"0",
        orient:'vertical'
    },
    series: [
      {
        type: "pie",
        //饼图半径
        radius: ["30%", "60%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        //文本标签
        label: {
          show:true,
        },
        //高亮效果
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        //视觉引导向
        labelLine: {
          show: true,
        },
        //数据
        data:radio.value=='品类'?arr:arr1,
       
      },
    ],
    //标题组件
    title:{
        //主标题
        text:radio.value=='品类'?arr[0].name:arr1[0].name,
        subtext:radio.value=='品类'?arr[0].value:arr1[0].value,
        //标题的位置
        left:'45%',
        top:'43%'
    }
  };
};

//鼠标进入事件
const handler = (params:any)=>{
   //设置新的配置项
   charts.value.setOption({
         title:{
            text:params.name,
            subtext:params.value
         }
   })
}
</script>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  color: yellowgreen;
}
.el-dropdown-link {
  color: yellowgreen;
}
</style>
