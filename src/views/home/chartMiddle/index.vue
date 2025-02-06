<template>
  <el-card style="margin: 10px 0px">
    <div class="header">
      <!-- 选项卡 -->
      <el-tabs class="demo-tabs" v-model="active">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 左侧日历 -->
      <div class="left">
        <span @click="setToday">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>

        <el-date-picker
          v-model="dateArr"
          type="daterange"
          range-separator="-"
          start-placeholder="入住时间"
          end-placeholder="离开时间"
          size="small"
          value-format="YYYY-MM-DD"
        />
      </div>
    </div>
    <!-- 栅格系统 -->
    <el-row :gutter="10">
      <el-col :span="18">
        <!--柱状图-->
        <v-chart :option="getBar()" style="height: 300px"></v-chart>
      </el-col>
      <el-col :span="6">
        <h1>门店{{ active == "sale" ? "销售额" : "访问量" }}排名</h1>
        <!-- 展示排名的数据结构 -->
        <ul class="sort" v-if="active == 'sale'">
          <li v-for="(item, index) in data.orderRank" :key="index">
            <span :class="{ activeName: index < 3 }">{{ item.no }}</span>
            <span>{{ item.name }}</span>
            <span>{{ item.count }}</span>
          </li>
        </ul>
        <ul class="sort" v-if="active == 'visite'">
          <li v-for="(item, index) in data.userRank" :key="index">
            <span :class="{ activeName: index < 3 }">{{ item.no }}</span>
            <span>{{ item.name }}</span>
            <span>{{ item.count }}</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
//处理时间的插件dayjs
import dayjs from "dayjs";
const active = ref("sale");
//收集日历数据
const dateArr = ref<any>([]);

//点击今日按钮回调
const setToday = () => {
  const start = dayjs().format("YYYY-MM-DD");
  const end = dayjs().format("YYYY-MM-DD");
  dateArr.value = [start, end];
};
//点击本周
const setWeek = () => {
  const start = dayjs().day(1).format("YYYY-MM-DD");
  const end = dayjs().day(7).format("YYYY-MM-DD");
  dateArr.value = [start, end];
};
//本月
const setMonth = () => {
  const start = dayjs().startOf("month").format("YYYY-MM-DD");
  const end = dayjs().endOf("month").format("YYYY-MM-DD");
  dateArr.value = [start, end];
};
//本年
const setYear = () => {
  const start = dayjs().startOf("year").format("YYYY-MM-DD");
  const end = dayjs().endOf("year").format("YYYY-MM-DD");
  dateArr.value = [start, end];
};

//柱状图的配置项
const getBar = () => {
  return {
    title: {
      text: active.value == "sale" ? "销售额" : "访问量",
      left: "center",
      textStyle: {
        color: "yellowgreen",
      },
    },
    xAxis: {
      type: "category",
      //x轴底部的文字设置
      data: props.data.userFullYearAxis,
    },
    yAxis: {
      //轴线
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
    },
    series: {
      type: "bar",
      data: active.value == "sale" ? props.data.orderFullYear : props.data.userFullYear,
      //柱条的颜色
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "red", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "blue", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      //文本标签
      label: {
        show: true,
      },
    },
    grid: {
      left: 30,
      bottom: 30,
      right: 0,
    },
    //提示框组件
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
  };
};

//接受首页全部数据
const props = defineProps(["data"]);
</script>

<style scoped lang="scss">
::v-deep(.el-tabs__item) {
  color: yellowgreen;
}

::v-deep(.el-tabs__active-bar) {
  background-color: yellowgreen;
}

.header {
  position: relative;
  .left {
    position: absolute;
    right: 0;
    top: 10px;
    span {
      color: yellowgreen;
      margin: 0px 5px;
    }
  }
}

.sort {
  list-style: none;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
    span:nth-child(1) {
      display: inline-block;
      width: 15px;
      height: 15px;
    }
    .activeName {
      color: white;
      background: black;
      border-radius: 50%;
      text-align: center;
      line-height: 15px;
    }
  }
}
</style>
