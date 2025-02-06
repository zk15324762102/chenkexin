<template>
  <el-card class="container">
    <div class="header_title">
      <!-- 具名插槽 -->
      <slot name="header"></slot>
    </div>
    <div class="number">
      <!-- 具名插槽 -->
      <slot name="number"></slot>
    </div>
    <div class="charts">
      <!-- 具名插槽 -->
      <slot name="charts"></slot>
    </div>
    <div class="bottom">
      <!-- 具名插槽 -->
      <slot name="bottom"></slot>
    </div>
  </el-card>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
$color: yellowgreen;
.container {
  color: $color;
  .header_title {
    margin: 10px 0px;
    font-weight: 900;
  }
  .number {
    text-indent: 10px;
    font-weight: 800;
    animation: donghua .5s linear 0s 1;
  }
  .charts {
    height: 80px;
    border-bottom: 1px dashed yellowgreen;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }
  .bottom {
    margin-top: 10px;
  }
}

//定义动画
@keyframes donghua {
  from {
    transform: rotate(0deg);
  }
  to {
     transform: rotate(360deg);
  }
}
</style>
